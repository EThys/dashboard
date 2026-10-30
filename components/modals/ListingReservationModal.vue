<script setup lang="ts">
import { X, Loader2, Calendar, MessageSquare, Info } from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import ClockTimePicker from '@/components/front/ClockTimePicker.vue'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservations'
import { toast } from 'vue-sonner'

const props = defineProps<{
    isOpen: boolean
    listingId: number
    listingTitle: string
    type: 'vacance' | 'chambre' | 'standard'
}>()

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const resStore = useReservationStore()

const isHotelRoom = computed(() => props.type === 'chambre')

const isLoading = ref(false)
const form = reactive({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    arrivalTime: '14:00:00',
    message: '',
    type: 'STANDARD' as 'STANDARD' | 'VIP' | 'PREMIUM'
})

const handleSubmit = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
        toast.error("Veuillez vous connecter pour réserver.")
        return
    }

    if (!authStore.user?.certified) {
        toast.error("Certification requise", {
            description: "Vous devez certifier votre compte pour effectuer une réservation."
        })
        return navigateTo('/compte/certification-requise')
    }

    if (!form.endDate) {
        form.endDate = form.startDate
    }

    isLoading.value = true
    try {
        const res = await resStore.createReservation(props.type, props.listingId, {
            startDate: form.startDate,
            endDate: form.endDate,
            message: form.message,
            type: form.type,
            reservationHeure: isHotelRoom.value
                ? form.arrivalTime
                : new Date().toLocaleTimeString('fr-FR', { hour12: false })
        })

        if (res.success) {
            toast.success("Demande de réservation envoyée !", {
                description: "Votre demande a été transmise avec succès. Vous recevrez une confirmation sous peu."
            })
            emit('success')
            emit('close')
        } else {
            toast.error(res.message || "Impossible d'envoyer la réservation.")
        }
    } catch (e: any) {
        toast.error("Une erreur technique est survenue.")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div @click="$emit('close')" class="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in transition-opacity"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-slate-950 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-border animate-in zoom-in-95 duration-200">
          <!-- Header -->
          <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                  <h2 class="text-xl font-black text-slate-800">Finaliser la réservation</h2>
                  <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">{{ listingTitle }}</p>
              </div>
              <button @click="$emit('close')" class="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
                  <X class="h-5 w-5" />
              </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Date Début -->
                    <div class="space-y-2">
                        <Label class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                             <Calendar class="size-3" /> Date de début
                        </Label>
                        <Input type="date" v-model="form.startDate" required class="h-12 rounded-xl" />
                    </div>

                    <!-- Date Fin -->
                    <div class="space-y-2">
                         <Label class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                             <Calendar class="size-3" /> Date de fin
                        </Label>
                        <Input type="date" v-model="form.endDate" :min="form.startDate" class="h-12 rounded-xl" />
                    </div>
               </div>

               <div v-if="isHotelRoom" class="space-y-2">
                    <Label class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Calendar class="size-3" /> Heure d’arrivée
                    </Label>
                    <ClockTimePicker v-model="form.arrivalTime" />
               </div>

               <!-- Message -->
               <div class="space-y-2">
                    <Label class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <MessageSquare class="size-3" /> Message ou demande spéciale
                    </Label>
                    <textarea 
                      v-model="form.message" 
                      class="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                      placeholder="Ex: J'aimerais confirmer la disponibilité pour un groupe de 5 personnes..."
                    ></textarea>
               </div>

               <!-- Info Note -->
               <div class="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700">
                    <Info class="size-5 shrink-0" />
                    <p class="text-[11px] font-bold leading-relaxed">
                        Cette demande n'est pas un paiement immédiat. L'hôte vérifiera la disponibilité avant de confirmer definitivement votre séjour.
                    </p>
               </div>

               <div class="pt-4 flex gap-4">
                   <Button type="button" variant="ghost" @click="$emit('close')" class="flex-1 h-14 rounded-xl font-bold">Annuler</Button>
                   <Button type="submit" :disabled="isLoading" class="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all">
                       <Loader2 v-if="isLoading" class="mr-2 h-5 w-5 animate-spin" />
                       {{ isLoading ? 'Envoi...' : 'Confirmer la demande' }}
                   </Button>
               </div>
          </form>
      </div>
  </div>
</template>
