import { toast } from 'vue-sonner'

export default defineNuxtPlugin(() => {
    // Log pour vérifier que le plugin est chargé
    console.log('Toast plugin initialized')

    return {
        provide: {
            toast
        }
    }
})
