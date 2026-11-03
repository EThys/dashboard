<script setup lang="ts">
import {
    Smartphone,
    CreditCard,
    CheckCircle2,
    Loader2,
    Shield,
    Infinity,
    FileText,
} from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { usePaymentStore, type PaymentRow } from '@/stores/payment'
import { downloadPaymentReceiptPdf } from '@/utils/paymentInvoicePdf'
import { toast } from 'vue-sonner'
import { h, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { addStompNotificationHandler, isSubscriptionNotification } from '@/utils/stompUserQueue'

definePageMeta({
    layout: 'dashboard',
})

useHead({
    title: 'Abonnement Premium',
})

const config = useRuntimeConfig()
const auth = useAuthStore()
const payment = usePaymentStore()

const latestPayment = ref<PaymentRow | null>(null)
const isDownloading = ref(false)

const SUBSCRIPTION_USD = 5

const selectedMethod = ref<'mobile' | 'card'>('mobile')
const selectedCurrency = ref<'USD' | 'CDF'>('USD')
const phoneLocal = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const paymentStep = ref(0)
const isProcessing = ref(false)

const unsubStomp = ref<(() => void) | null>(null)

const detectedNetwork = computed(() => {
    let text = phoneLocal.value.replace(/\D/g, '')
    if (text.startsWith('0') && text.length > 1) text = text.slice(1)
    if (text.length < 2) return 'Inconnu'
    const p2 = text.slice(0, 2)
    if (['81', '82', '83', '86'].includes(p2)) return 'Vodacom'
    if (['84', '85', '89', '80'].includes(p2)) return 'Orange'
    if (['97', '98', '99', '96'].includes(p2)) return 'Airtel'
    if (['90', '91'].includes(p2)) return 'Africell'
    return 'Inconnu'
})

const isPhoneValid = computed(() => {
    const digits = phoneLocal.value.replace(/\D/g, '')
    return digits.length === 9 && detectedNetwork.value !== 'Inconnu'
})

const fee = computed(() => (selectedCurrency.value === 'USD' ? 0.13 : 275))

const subtotalConverted = computed(() =>
    payment.convert(SUBSCRIPTION_USD, 'USD', selectedCurrency.value)
)

const totalConverted = computed(() => subtotalConverted.value + fee.value)

function formatMoney(val: number, code: string) {
    if (code === 'CDF') {
        const n = Math.round(val)
        return `${n.toLocaleString('fr-FR')} FC`
    }
    return `$${val.toFixed(2)}`
}

const formattedSubtotal = computed(() => formatMoney(subtotalConverted.value, selectedCurrency.value))
const formattedFee = computed(() => formatMoney(fee.value, selectedCurrency.value))
const formattedTotal = computed(() => formatMoney(totalConverted.value, selectedCurrency.value))

watch(phoneLocal, (v) => {
    let d = v.replace(/\D/g, '')
    if (d.startsWith('0') && d.length > 1) {
        d = d.slice(1)
        if (d !== phoneLocal.value.replace(/\D/g, '')) phoneLocal.value = d
    }
})

onMounted(() => {
    payment.fetchDevises(config.public.apiBase as string)

    const route = useRoute()
    const status = route.query.status || route.query.state || route.query.payment_status || route.query.error
    if (status) {
        const s = String(status).toLowerCase()
        setTimeout(async () => {
            if (s === 'success' || s === 'successful' || s === 'approved') {
                auth.setPremium(true)
                toast.success('Paiement réussi !')
            } else if (s === 'cancel' || s === 'cancelled' || s === 'canceled') {
                toast.info('Paiement annulé')
            } else {
                toast.error('Paiement échoué')
            }
        }, 100)
    }

    // WebSocket listener
    unsubStomp.value = addStompNotificationHandler((data: any) => {
        if (!isSubscriptionNotification(data)) return
        const tag = String(data.tag || '').toUpperCase()
        const msg = String(data.message || data.body || '').toLowerCase()
        const userData = data.user as any

        // Si l'objet user est renvoyé avec premium: false, c'est un échec
        if (userData && userData.premium === false && tag.includes('SUBSCRIPTION')) {
            toast.error('Paiement non validé', { description: 'Votre statut est resté non-premium.' })
            paymentStep.value = 0
            isProcessing.value = false
            return
        }

        if (tag.includes('CANCEL') || msg.includes('annul') || msg.includes('échou')) {
            toast.error('Paiement annulé ou échoué')
            paymentStep.value = 0
            isProcessing.value = false
            return
        }

        // Succès si message positif, tag success OU si l'objet user confirme premium: true
        if (msg.includes('succès') || msg.includes('activé') || tag.includes('SUCCESS') || tag.includes('CONFIRMED') || (userData && userData.premium === true)) {
            auth.setPremium(true)
            paymentStep.value = 3
            toast.success('Abonnement Premium activé !', {
                description: 'Vous pouvez maintenant profiter de tous les services.',
                icon: h(CheckCircle2, { class: 'size-5 text-[#1976D2]' }),
            })
            setTimeout(() => navigateTo('/properties'), 2000)
        }
    })
})

onUnmounted(() => {
    if (unsubStomp.value) unsubStomp.value()
})

async function processPayment() {
    if (isProcessing.value) return
    if (selectedMethod.value === 'mobile' && !isPhoneValid.value) {
        toast.error('Numéro invalide')
        return
    }

    isProcessing.value = true
    paymentStep.value = 1
    
    try {
        const deviseId = payment.resolveDeviseId(selectedCurrency.value)
        if (selectedMethod.value === 'mobile') {
            const finalPhone = `243${phoneLocal.value.replace(/\D/g, '')}`
            const res = await payment.subscribe(config.public.apiBase as string, finalPhone, deviseId)
            if (res.success) {
                paymentStep.value = 2 // Attente du push
                toast.info('Validation requise', { description: 'Validez le message push sur votre téléphone.' })
            } else {
                toast.error('Erreur', { description: res.message })
                paymentStep.value = 0
                isProcessing.value = false
            }
        } else {
            const res = await payment.payWithCard(config.public.apiBase as string, deviseId)
            if (res.success && (res.data?.url || res.data?.data?.url)) {
                window.location.href = res.data?.url || res.data?.data?.url
            } else {
                toast.error('Erreur technique')
                paymentStep.value = 0
                isProcessing.value = false
            }
        }
    } catch (e) {
        toast.error('Erreur de connexion')
        paymentStep.value = 0
        isProcessing.value = false
    }
}

async function handleDownloadLatest() {
    if (!latestPayment.value) return
    isDownloading.value = true
    try {
        const username = auth.user?.username || auth.profile?.fullName || 'Client CasaNayo'
        await downloadPaymentReceiptPdf(latestPayment.value, username)
        toast.success('Reçu téléchargé.')
    } catch (e) {
        toast.error('Erreur téléchargement.')
    } finally {
        isDownloading.value = false
    }
}

const perks = [
    { icon: Infinity, text: 'Réservations et annonces illimitées pendant 12 mois' },
    { icon: Shield, text: 'Accès complet après profil certifié et abonnement actif' },
    { icon: FileText, text: 'Reçu PDF téléchargeable depuis l’historique des paiements' },
]

const networkClass = computed(() => {
    if (detectedNetwork.value === 'Vodacom') return 'bg-red-50 text-red-600'
    if (detectedNetwork.value === 'Orange') return 'bg-orange-50 text-orange-600'
    if (detectedNetwork.value === 'Airtel') return 'bg-rose-50 text-rose-700'
    if (detectedNetwork.value === 'Africell') return 'bg-violet-50 text-violet-700'
    return 'bg-slate-100 text-slate-500'
})

const isPremium = computed(() => !!auth.user?.premium)
</script>

<template>
  <div class="text-slate-900">
    <div>
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1976D2]">CasaNayo</p>
          <h1 class="text-2xl font-black text-slate-900">Abonnement Premium</h1>
        </div>
        <NuxtLink
          to="/compte/paiements"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#1976D2] shadow-sm transition hover:bg-[#E3F2FD]"
        >
          Historique et reçus
        </NuxtLink>
      </div>

      <div class="grid items-stretch gap-6 lg:grid-cols-2">
        <section class="flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#42A5F5] text-white shadow-xl">
          <div class="p-7 sm:p-8">
            <p class="text-sm font-medium text-blue-100">{{ isPremium ? 'Abonnement en cours' : 'Offre annuelle' }}</p>
            <p class="mt-3 text-4xl font-black tracking-tight">5 $ <span class="text-lg font-semibold text-blue-100">/ an</span></p>
            <p class="mt-3 text-sm leading-relaxed text-blue-50">
              Publiez, réservez et gérez vos biens pendant un an. Le montant s’affiche dans la devise choisie.
            </p>

            <div class="mt-6 inline-flex rounded-2xl bg-white/15 p-1">
              <button
                type="button"
                class="rounded-xl px-4 py-2 text-sm font-bold transition"
                :class="selectedCurrency === 'USD' ? 'bg-white text-[#1565C0]' : 'text-white/80'"
                @click="selectedCurrency = 'USD'"
              >
                USD
              </button>
              <button
                type="button"
                class="rounded-xl px-4 py-2 text-sm font-bold transition"
                :class="selectedCurrency === 'CDF' ? 'bg-white text-[#1565C0]' : 'text-white/80'"
                @click="selectedCurrency = 'CDF'"
              >
                FC
              </button>
            </div>

            <div v-if="isPremium && !latestPayment" class="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
              Vous êtes déjà Premium. Vous pouvez renouveler ou consulter vos reçus.
            </div>
            <div v-else-if="latestPayment" class="mt-6 rounded-2xl bg-white/15 px-4 py-4">
              <div class="flex items-center gap-3">
                <CheckCircle2 class="size-7" />
                <div>
                  <p class="font-black">Paiement validé</p>
                  <p class="text-sm text-blue-50">Transaction #{{ latestPayment.reference ?? latestPayment.id }}</p>
                </div>
              </div>
              <button
                type="button"
                class="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#1565C0] disabled:opacity-50"
                :disabled="isDownloading"
                @click="handleDownloadLatest"
              >
                <Loader2 v-if="isDownloading" class="size-4 animate-spin" />
                <FileText v-else class="size-4" />
                Télécharger le reçu
              </button>
            </div>
          </div>
          <ul class="mt-auto flex-1 space-y-3 bg-white px-6 py-6 text-slate-700 sm:px-8">
            <li v-for="(item, i) in perks" :key="i" class="flex items-start gap-3">
              <span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">
                <component :is="item.icon" class="size-4" />
              </span>
              <span class="text-sm font-medium leading-snug">{{ item.text }}</span>
            </li>
          </ul>
        </section>

        <section class="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div class="border-b border-slate-100 px-6 py-5 sm:px-8">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Paiement</p>
            <h2 class="text-lg font-black text-slate-900">{{ isPremium ? 'Renouveler' : 'Activer Premium' }}</h2>
          </div>

          <div class="flex flex-1 flex-col p-6 sm:p-8">
            <div v-if="isProcessing" class="py-10 text-center">
              <Loader2 class="mx-auto size-11 animate-spin text-[#1976D2]" />
              <p class="mt-4 font-black text-slate-900">
                {{ paymentStep === 1 ? 'Connexion au paiement…' : paymentStep === 2 ? 'En attente de votre validation' : 'Activation du compte' }}
              </p>
              <ol class="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
                <li :class="paymentStep >= 1 ? 'font-bold text-[#1976D2]' : 'text-slate-400'">1. Envoi de la demande</li>
                <li :class="paymentStep >= 2 ? 'font-bold text-[#1976D2]' : 'text-slate-400'">2. Validation sur le téléphone</li>
                <li :class="paymentStep >= 3 ? 'font-bold text-[#1976D2]' : 'text-slate-400'">3. Premium activé</li>
              </ol>
            </div>

            <div v-else class="flex flex-1 flex-col gap-6">
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  class="rounded-2xl border-2 p-4 text-left transition"
                  :class="selectedMethod === 'mobile' ? 'border-[#1976D2] bg-[#E3F2FD]' : 'border-slate-200 hover:border-slate-300'"
                  @click="selectedMethod = 'mobile'"
                >
                  <Smartphone class="size-5 text-[#1976D2]" />
                  <p class="mt-3 font-black text-slate-900">Mobile Money</p>
                  <p class="mt-1 text-xs text-slate-500">Vodacom, Orange, Airtel, Africell</p>
                </button>
                <button
                  type="button"
                  class="rounded-2xl border-2 p-4 text-left transition"
                  :class="selectedMethod === 'card' ? 'border-[#1976D2] bg-[#E3F2FD]' : 'border-slate-200 hover:border-slate-300'"
                  @click="selectedMethod = 'card'"
                >
                  <CreditCard class="size-5 text-[#1976D2]" />
                  <p class="mt-3 font-black text-slate-900">Carte bancaire</p>
                  <p class="mt-1 text-xs text-slate-500">Page sécurisée du partenaire</p>
                </button>
              </div>

              <div v-if="selectedMethod === 'mobile'" class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label class="text-xs font-bold uppercase text-slate-500">Numéro Mobile Money</Label>
                  <span class="rounded-full px-2.5 py-1 text-[10px] font-black uppercase" :class="networkClass">{{ detectedNetwork }}</span>
                </div>
                <div
                  class="flex overflow-hidden rounded-2xl border-2 bg-white transition-colors"
                  :class="isPhoneValid ? 'border-[#1976D2]' : 'border-slate-200'"
                >
                  <span class="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold">+243</span>
                  <Input
                    v-model="phoneLocal"
                    type="tel"
                    inputmode="numeric"
                    class="border-0 text-lg font-semibold focus-visible:ring-0"
                    placeholder="812 345 678"
                  />
                </div>
                <p class="text-xs text-slate-500">9 chiffres, sans le 0. Un message de confirmation s’affiche sur le téléphone.</p>
              </div>

              <div v-else class="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <div class="flex items-start gap-3">
                  <Shield class="mt-0.5 size-5 shrink-0 text-[#1976D2]" />
                  <p class="text-sm leading-relaxed text-slate-600">
                    Le numéro de carte se saisit sur la page du partenaire, après le bouton Payer. CasaNayo ne conserve pas ces données.
                  </p>
                </div>
              </div>

              <div class="mt-auto rounded-2xl bg-slate-50 px-4 py-4 text-sm">
                <div class="flex justify-between text-slate-500">
                  <span>Abonnement</span>
                  <span>{{ formattedSubtotal }}</span>
                </div>
                <div class="mt-2 flex justify-between text-slate-500">
                  <span>Frais</span>
                  <span>{{ formattedFee }}</span>
                </div>
                <div class="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
                  <span>Total</span>
                  <span class="text-[#1976D2]">{{ formattedTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="sticky bottom-0 z-20 mt-6 rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md sm:px-6">
        <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-[10px] font-bold uppercase text-slate-400">À payer</p>
          <p class="text-2xl font-black text-[#1976D2]">{{ formattedTotal }}</p>
        </div>
        <Button
          class="h-12 min-w-[180px] rounded-2xl bg-[#1976D2] text-base font-bold hover:bg-[#1565C0]"
          :disabled="isProcessing || (selectedMethod === 'mobile' && !isPhoneValid) || payment.isLoadingDevises"
          @click="processPayment"
        >
          <Loader2 v-if="isProcessing" class="mr-2 size-4 animate-spin" />
          {{ isPremium ? 'Renouveler' : 'Payer' }} {{ formattedTotal }}
        </Button>
        </div>
      </div>
    </div>
  </div>
</template>
