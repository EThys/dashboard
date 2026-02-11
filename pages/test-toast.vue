<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui'

const testSuccess = () => {
  console.log('Test success toast')
  toast.success('Test de succès', {
    description: 'Ce toast devrait être vert',
    duration: 5000,
  })
}

const testError = () => {
  console.log('Test error toast')
  toast.error('Test d\'erreur', {
    description: 'Ce toast devrait être rouge',
    duration: 5000,
  })
}

const testInfo = () => {
  console.log('Test info toast')
  toast.info('Test d\'info', {
    description: 'Ce toast devrait être bleu',
    duration: 5000,
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">Test des Toasts</h1>
      <div class="flex flex-col gap-4">
        <Button @click="testSuccess" class="bg-green-600 hover:bg-green-700">
          Test Success Toast
        </Button>
        <Button @click="testError" variant="destructive">
          Test Error Toast
        </Button>
        <Button @click="testInfo" variant="outline">
          Test Info Toast
        </Button>
      </div>
    </div>
  </div>
</template>
