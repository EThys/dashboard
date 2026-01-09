<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
    isOpen: boolean
    serviceId: number
    serviceTitle: string
    minPrice?: number
    currencyCode?: string
    deviseId?: number
}>()

const emit = defineEmits(['close', 'success'])

const config = useRuntimeConfig()
const authStore = useAuthStore()

const isLoading = ref(false)
const form = reactive({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    budget: props.minPrice || 0
})

const handleSubmit = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
        alert("Veuillez vous connecter pour faire une demande.")
        return
    }

    isLoading.value = true
    try {
        const payload = {
            userId: authStore.user.id,
            prestationId: props.serviceId,
            deviseId: props.deviseId || 1, 
            budget: Number(form.budget),
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate || form.startDate
        }

        await $fetch(`${config.public.apiBase}/sollicitation`, {
            method: 'POST',
            body: payload
        })

        emit('success')
        emit('close')
        alert("Votre demande a été envoyée avec succès !")
    } catch (e) {
        console.error(e)
        alert("Une erreur est survenue lors de l'envoi.")
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div @click="$emit('close')" class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in transition-opacity"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
          <button @click="$emit('close')" class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
              <X class="h-4 w-4" />
          </button>

          <h2 class="text-xl font-bold mb-1">Demander une intervention</h2>
          <p class="text-sm text-muted-foreground mb-6">Pour : {{ serviceTitle }}</p>

          <form @submit.prevent="handleSubmit" class="space-y-4">
               <!-- Date Début -->
               <div class="space-y-2">
                   <Label>Date de début *</Label>
                   <Input type="date" v-model="form.startDate" required />
               </div>

               <!-- Date Fin -->
               <div class="space-y-2">
                   <Label>Date de fin (Optionnel)</Label>
                   <Input type="date" v-model="form.endDate" :min="form.startDate" />
               </div>

               <!-- Budget -->
               <div class="space-y-2">
                   <Label>Votre budget estimé ({{ currencyCode || '$' }})</Label>
                   <Input type="number" step="0.01" v-model="form.budget" required />
               </div>

               <!-- Description -->
               <div class="space-y-2">
                   <Label>Description (Optionnel)</Label>
                   <textarea 
                     v-model="form.description" 
                     class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     placeholder="Détails sur votre besoin..."
                   ></textarea>
               </div>

               <div class="flex justify-end gap-3 pt-4">
                   <Button type="button" variant="ghost" @click="$emit('close')">Annuler</Button>
                   <Button type="submit" :disabled="isLoading">
                       <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                       Envoyer la demande
                   </Button>
               </div>
          </form>
      </div>
  </div>
</template>
