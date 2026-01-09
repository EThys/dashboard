<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogContent, DialogPortal, DialogOverlay } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineProps<{
    open?: boolean
}>()

const emit = defineEmits(['update:open'])
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger as="slot" />
    <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent 
            class="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm"
        >
            <div class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X class="h-4 w-4" @click="emit('update:open', false)" />
                <span class="sr-only">Close</span>
            </div>
            <slot name="content" />
        </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
