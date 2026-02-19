<script setup lang="ts">
import { MapPin, Phone, Mail, Send, Clock, Globe, ChevronDown } from 'lucide-vue-next'
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

const activeFaq = ref<number | null>(0)

const faqs = [
  {
    question: "Comment fonctionne la réservation sur l'application CasaNayo ?",
    answer: "C'est très simple ! Une fois que vous avez trouvé le bien qui vous intéresse, cliquez sur 'Réserver' ou 'Demander une visite'. Pour valider votre première réservation, un abonnement annuel de seulement 4$ est requis, vous offrant un accès illimité à toutes les opportunités du réseau pendant un an."
  },
  {
    question: "Quels sont les avantages d'utiliser votre plateforme web ?",
    answer: "CasaNayo centralise les meilleures offres immobilières de Kinshasa et de la RDC. Vous profitez d'une interface ultra-rapide, de filtres intelligents, et d'un système de messagerie sécurisé pour communiquer en toute transparence."
  },
  {
    question: "Comment garantissez-vous la véracité des annonces ?",
    answer: "Chaque annonce publiée sur notre application web et mobile passe par un processus de modération. Nous vérifions les documents de propriété et l'identité des annonceurs pour vous garantir une expérience sécurisée et sans mauvaises surprises."
  },
  {
    question: "Puis-je lister mon propre bien sur CasaNayo ?",
    answer: "Absolument ! Créez un compte 'Propriétaire' pour commencer à publier vos biens. Pour activer la mise en ligne de vos annonces, un abonnement de 4$ par an est nécessaire, incluant des outils de gestion avancés pour suivre vos réservations en temps réel."
  }
]
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
          Une question sur notre application web ? Un projet immobilier à concrétiser ? Notre équipe d'experts et nos outils digitaux sont là pour vous offrir l'expérience la plus fluide de RDC.
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

    <!-- FAQ Section -->
    <section class="py-24 bg-white border-t border-slate-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16 space-y-4">
            <span class="text-primary font-bold tracking-widest uppercase text-[10px]">Questions Fréquentes</span>
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Tout ce que vous devez savoir</h2>
            <p class="text-slate-500 font-medium">Vous avez des questions sur l'utilisation de notre application ? Voici les réponses aux interrogations les plus fréquentes.</p>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(item, index) in faqs" 
              :key="index" 
              class="group rounded-[32px] bg-white border border-slate-100 transition-all duration-500 overflow-hidden"
              :class="{ 'border-primary/30 shadow-xl shadow-primary/5': activeFaq === index }"
            >
              <button 
                @click="activeFaq = activeFaq === index ? null : index"
                class="w-full p-6 md:p-8 flex items-center justify-between text-left"
              >
                <h3 class="text-lg font-black text-slate-900 flex items-center gap-4">
                  <span class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">{{ index + 1 }}</span>
                  {{ item.question }}
                </h3>
                <ChevronDown 
                  class="size-5 text-slate-400 transition-transform duration-500"
                  :class="{ 'rotate-180 text-primary': activeFaq === index }"
                />
              </button>

              <div 
                class="grid transition-all duration-500 ease-in-out"
                :class="activeFaq === index ? 'grid-rows-[1fr] opacity-100 pb-8 px-8 md:px-12 ml-4' : 'grid-rows-[0fr] opacity-0 pb-0'"
              >
                <div class="overflow-hidden">
                  <p class="text-slate-600 leading-relaxed font-medium pl-12 border-l-2 border-primary/20">
                    {{ item.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
