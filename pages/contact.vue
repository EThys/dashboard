<script setup lang="ts">
import { MapPin, Phone, Mail, Send, Clock, Globe } from 'lucide-vue-next'
import { Button } from '@/components/ui'

definePageMeta({
  layout: 'default'
})

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  // Simulation d'envoi
  await new Promise(resolve => setTimeout(resolve, 1500))
  alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
  formData.value = { name: '', email: '', subject: '', message: '' }
  isSubmitting.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <section class="relative py-24 overflow-hidden bg-slate-900 border-b border-white/5">
      <div class="absolute inset-0 z-0">
        <img src="@/assets/lingwala.jpg" class="w-full h-full object-cover opacity-40" alt="Contact background" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div class="absolute -top-24 -right-24 size-96 bg-primary/20 rounded-full blur-[120px]"></div>
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
          Contactez <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">CasaNayo</span>
        </h1>
        <p class="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Une question ? Un projet immobilier ? Notre équipe d'experts est à votre écoute pour vous accompagner dans toutes vos démarches.
        </p>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Contact Info -->
          <div class="lg:col-span-12 xl:col-span-5 space-y-8">
            <div class="space-y-6">
              <h2 class="text-3xl font-black text-slate-900 leading-tight">Nos coordonnées</h2>
              <p class="text-slate-500 font-medium">N'hésitez pas à nous rendre visite ou à nous contacter directement par téléphone ou email.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-6">
              <!-- Siège Social -->
              <div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                <div class="flex items-start gap-5">
                  <div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <MapPin class="size-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Siège Social</h3>
                    <p class="text-base font-bold text-slate-800 leading-relaxed">
                      Av. Sénégalais, Gare Centrale<br>
                      Kinshasa Gombe, RDC
                    </p>
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                <div class="flex items-start gap-5">
                  <div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">
                    <Phone class="size-6 text-blue-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Téléphone</h3>
                    <p class="text-base font-bold text-slate-800">+243 836 323 805</p>
                    <p class="text-sm text-slate-400 font-medium mt-1">Disponible 24h/24 par WhatsApp</p>
                  </div>
                </div>
              </div>

              <!-- Support -->
              <div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-400/5 transition-all duration-500">
                <div class="flex items-start gap-5">
                  <div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center shrink-0 group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">
                    <Mail class="size-6 text-sky-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Support</h3>
                    <p class="text-base font-bold text-slate-800">contact@casanayo.com</p>
                    <p class="text-sm text-slate-400 font-medium mt-1">Réponse sous 24h ouvrées</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Hours / More info -->
            <div class="p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group">
              <div class="absolute -right-12 -bottom-12 size-48 bg-primary/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
              <div class="relative z-10 space-y-6">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Clock class="size-4 text-primary-foreground" />
                  </div>
                  <h4 class="text-lg font-bold">Heures d'ouverture</h4>
                </div>
                <div class="space-y-3 font-medium text-slate-300">
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Lundi - Vendredi</span>
                    <span class="text-white font-bold text-sm">08:00 - 18:00</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Samedi</span>
                    <span class="text-white font-bold text-sm">09:00 - 15:00</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span>Dimanche</span>
                    <span class="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-12 xl:col-span-7">
            <div class="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
              <div class="mb-10">
                <h3 class="text-2xl font-black text-slate-900 mb-4">Envoyez-nous un message</h3>
                <p class="text-slate-500 font-medium">Remplissez ce formulaire et un consultant prendra contact avec vous.</p>
              </div>

              <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
                  <input 
                    v-model="formData.name"
                    required
                    type="text" 
                    placeholder="Ebaka Phambu"
                    class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <input 
                    v-model="formData.email"
                    required
                    type="email" 
                    placeholder="ebaka.phambu@email.com"
                    class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sujet</label>
                  <input 
                    v-model="formData.subject"
                    required
                    type="text" 
                    placeholder="Demande d'information pour une villa"
                    class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea 
                    v-model="formData.message"
                    required
                    rows="5"
                    placeholder="Comment pouvons-nous vous aider ?"
                    class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 resize-none"
                  ></textarea>
                </div>
                <div class="md:col-span-2 pt-4">
                  <Button 
                    type="submit" 
                    :disabled="isSubmitting"
                    class="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    <span v-if="!isSubmitting">Envoyer le message</span>
                    <span v-else>Envoi en cours...</span>
                    <Send v-if="!isSubmitting" class="size-5" />
                    <div v-else class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
