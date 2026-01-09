<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
    isOpen: boolean
    propertyId: number
    propertyTitle: string
}>()

const emit = defineEmits(['close', 'success'])

const config = useRuntimeConfig()
const authStore = useAuthStore()

const isLoading = ref(false)
const availableHours = Array.from({ length: 12 }, (_, i) => {
    const h = i + 7 // Starts at 7
    return `${h.toString().padStart(2, '0')}:00:00`
})

const form = reactive({
    date: new Date().toISOString().split('T')[0],
    time: '10:00:00',
    message: ''
})

const handleSubmit = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
        alert("Veuillez vous connecter pour programmer une visite.")
        return
    }

    isLoading.value = true
    try {
        const payload = {
            userId: authStore.user.id,
            propertyId: props.propertyId,
            startDate: form.date,
            endDate: form.date,
            message: form.message || "Je souhaite visiter ce bien.",
            createdAt: new Date().toISOString(),
            status: "PENDING",
            type: "VIP",
            reservationHeure: form.time
        }

        await $fetch(`${config.public.apiBase}/reservations`, {
            method: 'POST',
            body: payload
        })

        emit('success')
        emit('close')
        alert("Visite programmée avec succès !")
    } catch (e) {
        console.error(e)
        alert("Erreur lors de la programmation.")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="$emit('close')" class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in transition-opacity"></div>
      
      <div class="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
          <button @click="$emit('close')" class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
              <X class="h-4 w-4" />
          </button>

          <h2 class="text-xl font-bold mb-1">Programmer une visite</h2>
          <p class="text-sm text-muted-foreground mb-6">Pour : {{ propertyTitle }}</p>

          <form @submit.prevent="handleSubmit" class="space-y-4">
               <div class="space-y-2">
                   <Label>Date souhaitée</Label>
                   <Input type="date" v-model="form.date" required />
               </div>

               <div class="space-y-2">
                   <Label>Heure (07h - 18h)</Label>
                   <select 
                     v-model="form.time"
                     class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                        <option v-for="h in availableHours" :key="h" :value="h">
                            {{ h.slice(0, 5) }}
                        </option>
                   </select>
               </div>

               <div class="space-y-2">
                   <Label>Message (Optionnel)</Label>
                   <textarea 
                     v-model="form.message" 
                     class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     placeholder="Je souhaite visiter ce bien..."
                   ></textarea>
               </div>

               <div class="flex justify-end gap-3 pt-4">
                   <Button type="button" variant="ghost" @click="$emit('close')">Annuler</Button>
                   <Button type="submit" :disabled="isLoading">
                       <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                       Valider la visite
                   </Button>
               </div>
          </form>
      </div>
  </div>
</template>
