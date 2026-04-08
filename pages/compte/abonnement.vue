<script setup lang="ts">
import {
    ArrowLeft,
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
import { usePaymentStore } from '@/stores/payment'
import { toast } from 'vue-sonner'
import { h } from 'vue'

definePageMeta({
    layout: 'default',
})

useHead({
    title: 'Abonnement Premium',
})

const config = useRuntimeConfig()
const auth = useAuthStore()
const payment = usePaymentStore()

const SUBSCRIPTION_USD = 5

const selectedMethod = ref<'mobile' | 'card'>('mobile')
const selectedCurrency = ref<'USD' | 'CDF'>('USD')
const phoneLocal = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const paymentStep = ref(0)
const isProcessing = ref(false)

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
})

async function processPayment() {
    if (selectedMethod.value === 'mobile') {
        if (!isPhoneValid.value) {
            toast.error('Numéro invalide', {
                description: '9 chiffres sans le 0, réseau mobile RDC reconnu.',
            })
            return
        }
    } else {
        if (!cardNumber.value.trim() || !cardExpiry.value.trim() || !cardCvv.value.trim()) {
            toast.error('Carte incomplète', { description: 'Renseignez tous les champs.' })
            return
        }
    }

    isProcessing.value = true
    paymentStep.value = 1

    try {
        if (selectedMethod.value === 'mobile') {
            const digits = phoneLocal.value.replace(/\D/g, '')
            const finalPhone = `243${digits}`
            await new Promise((r) => setTimeout(r, 800))
            paymentStep.value = 2

            const deviseId = payment.resolveDeviseId(selectedCurrency.value)
            const res = await payment.subscribe(config.public.apiBase as string, finalPhone, deviseId)

            if (!res.success) {
                toast.error('Paiement', { description: res.message })
                paymentStep.value = 0
                return
            }

            paymentStep.value = 3
            await new Promise((r) => setTimeout(r, 600))
            auth.setPremium(true)
            toast.success('Abonnement activé', {
                description: 'Vous pouvez désormais effectuer des réservations.',
                icon: h(CheckCircle2, { class: 'size-5 text-[#1976D2]' }),
            })
            await navigateTo('/properties')
        } else {
            await new Promise((r) => setTimeout(r, 1200))
            paymentStep.value = 2
            await new Promise((r) => setTimeout(r, 1500))
            paymentStep.value = 3
            await new Promise((r) => setTimeout(r, 500))
            auth.setPremium(true)
            toast.success('Abonnement activé (démo carte)', {
                description: 'Comportement aligné sur l’application mobile.',
                icon: h(CheckCircle2, { class: 'size-5 text-[#1976D2]' }),
            })
            await navigateTo('/properties')
        }
    } catch (e) {
        console.error(e)
        toast.error('Erreur', { description: 'Une erreur est survenue.' })
        paymentStep.value = 0
    } finally {
        isProcessing.value = false
        if (paymentStep.value !== 3) paymentStep.value = 0
    }
}

const perks = [
    { icon: Infinity, text: 'Réservations et annonces illimitées pendant 12 mois' },
    { icon: Shield, text: 'Accès complet après profil certifié + abonnement actif' },
    { icon: FileText, text: 'Reçu PDF téléchargeable depuis l’historique des paiements' },
]
</script>

<template>
  <div class="min-h-screen bg-[#F5F6FA] text-slate-900">
    <!-- Bandeau top -->
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#1976D2]/40 hover:text-[#1976D2]"
            aria-label="Retour"
          >
            <ArrowLeft class="size-5" />
          </NuxtLink>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1976D2]">CasaNayo</p>
            <h1 class="text-lg font-bold text-slate-900 sm:text-xl">Abonnement Premium</h1>
          </div>
        </div>
        <NuxtLink
          to="/compte/paiements"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#1976D2] shadow-sm transition hover:border-[#1976D2]/50 hover:bg-[#E3F2FD]"
        >
          Historique & reçus
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8 pb-40 sm:px-6 sm:py-12">
      <!-- Hero carte -->
      <div
        class="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] via-[#1E88E5] to-[#1565C0] p-8 text-white shadow-xl sm:p-10"
      >
        <p class="text-sm font-medium text-blue-100">Offre annuelle</p>
        <p class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          5 $ US <span class="text-xl font-bold text-blue-100">/ an</span>
        </p>
        <p class="mt-4 max-w-xl text-sm leading-relaxed text-blue-50/95">
          Publiez vos biens, vos services et réservez sans limite. Paiement Mobile Money réel ; carte
          bancaire en démonstration (comme sur l’app).
        </p>
        <div
          v-if="auth.user?.premium"
          class="mt-6 inline-flex rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
        >
          Vous êtes déjà Premium — consultez vos reçus dans l’historique.
        </div>
      </div>

      <div class="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <div class="space-y-4 lg:col-span-2">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Inclus</h2>
          <ul class="space-y-3">
            <li
              v-for="(item, i) in perks"
              :key="i"
              class="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]"
              >
                <component :is="item.icon" class="size-5" />
              </div>
              <p class="text-sm font-medium leading-snug text-slate-700">{{ item.text }}</p>
            </li>
          </ul>
        </div>

        <div class="lg:col-span-3">
          <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div class="border-b border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Paiement</p>
              <p class="font-bold text-slate-900">Choisir le mode</p>
            </div>

            <div class="p-6 sm:p-8">
              <div class="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  class="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all"
                  :class="
                    selectedMethod === 'mobile'
                      ? 'bg-white text-[#1976D2] shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  "
                  @click="selectedMethod = 'mobile'"
                >
                  <Smartphone class="size-4" />
                  Mobile Money
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all"
                  :class="
                    selectedMethod === 'card'
                      ? 'bg-white text-[#1976D2] shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  "
                  @click="selectedMethod = 'card'"
                >
                  <CreditCard class="size-4" />
                  Carte
                </button>
              </div>

              <div v-if="isProcessing" class="flex flex-col items-center gap-4 py-12">
                <Loader2 class="size-11 animate-spin text-[#1976D2]" />
                <p class="text-center font-bold text-slate-900">
                  {{
                    paymentStep === 1
                      ? 'Connexion sécurisée…'
                      : paymentStep === 2
                        ? 'Validation opérateur…'
                        : 'Confirmation'
                  }}
                </p>
                <p class="text-center text-sm text-slate-500">
                  Validez sur votre téléphone si une demande s’affiche.
                </p>
              </div>

              <div v-else class="space-y-6">
                <template v-if="selectedMethod === 'mobile'">
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <Label class="text-xs font-bold uppercase text-slate-500">Numéro</Label>
                      <span class="text-[10px] font-bold text-[#1976D2]">{{ detectedNetwork }}</span>
                    </div>
                    <div
                      class="flex overflow-hidden rounded-2xl border-2 bg-white transition-colors"
                      :class="isPhoneValid ? 'border-[#1976D2]' : 'border-slate-200'"
                    >
                      <span
                        class="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold"
                      >
                        🇨🇩 +243
                      </span>
                      <Input
                        v-model="phoneLocal"
                        type="tel"
                        class="border-0 text-lg font-semibold focus-visible:ring-0"
                        placeholder="854434602"
                      />
                    </div>
                    <p class="text-xs text-slate-500">9 chiffres sans le 0 initial.</p>
                  </div>
                </template>

                <template v-else>
                  <Label class="text-xs font-bold uppercase text-slate-500">Carte (démo)</Label>
                  <Input v-model="cardNumber" placeholder="Numéro" class="rounded-xl" />
                  <div class="grid grid-cols-2 gap-3">
                    <Input v-model="cardExpiry" placeholder="MM/AA" class="rounded-xl" />
                    <Input v-model="cardCvv" placeholder="CVV" class="rounded-xl" />
                  </div>
                  <p class="rounded-xl border border-blue-100 bg-[#E3F2FD] px-3 py-2 text-xs text-slate-700">
                    La carte ne débite pas réellement sur le web — uniquement Mobile Money appelle
                    l’API de paiement.
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Récap fixe -->
    <div
      class="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(25,118,210,0.08)] backdrop-blur-md sm:px-6"
    >
      <div class="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-end gap-6">
          <div>
            <p class="text-[10px] font-bold uppercase text-slate-500">Total</p>
            <p class="text-2xl font-black text-[#1976D2]">{{ formattedTotal }}</p>
          </div>
          <div class="flex gap-6 text-xs text-slate-600">
            <div>
              <span class="block text-[10px] font-bold uppercase text-slate-400">Sous-total</span>
              {{ formattedSubtotal }}
            </div>
            <div>
              <span class="block text-[10px] font-bold uppercase text-slate-400">Frais</span>
              {{ formattedFee }}
            </div>
          </div>
          <div class="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
              :class="selectedCurrency === 'USD' ? 'bg-[#1976D2] text-white' : 'text-slate-500'"
              @click="selectedCurrency = 'USD'"
            >
              USD
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-bold transition"
              :class="selectedCurrency === 'CDF' ? 'bg-[#1976D2] text-white' : 'text-slate-500'"
              @click="selectedCurrency = 'CDF'"
            >
              CDF
            </button>
          </div>
        </div>
        <Button
          class="h-12 w-full shrink-0 rounded-2xl bg-[#1976D2] text-base font-bold hover:bg-[#1565C0] sm:w-auto sm:min-w-[200px]"
          :disabled="
            isProcessing || (selectedMethod === 'mobile' ? !isPhoneValid : false) || payment.isLoadingDevises
          "
          @click="processPayment"
        >
          Payer {{ formattedTotal }}
        </Button>
      </div>
    </div>
  </div>
</template>
