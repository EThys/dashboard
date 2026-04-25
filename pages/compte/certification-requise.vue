<script setup lang="ts">
import { ShieldAlert, Check } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
    reason?: string
}>()

const router = useRouter()
const reasonText = computed(() => props.reason || "Votre certification a été suspendue car vos documents ne sont pas valides ou ne respectent pas nos règles de sécurité actuelles.")

const benefits = [
    "Publier des annonces immobilières",
    "Proposer des services professionnels",
    "Effectuer des réservations"
]

const authStore = useAuthStore()

onMounted(() => {
    if (authStore.user?.certified) {
        router.push('/dashboard')
    }
})

const goBack = () => router.back()
const updateDocs = () => router.push('/compte/profile')
</script>

<template>
  <div class="google-wrapper">
    <div class="google-container animate-fade-in">
      
      <div class="icon-section">
        <ShieldAlert class="google-icon" :size="48" :stroke-width="1.5" />
      </div>

      <h1 class="google-title">
        Mise à jour requise
      </h1>

      <p class="google-subtitle">
        {{ reasonText }}
      </p>

      <div class="benefits-card">
        <h2 class="benefits-label">Pourquoi se certifier</h2>
        <ul class="benefits-list">
          <li v-for="(benefit, index) in benefits" :key="index" class="benefit-item">
            <Check class="check-icon" :size="20" :stroke-width="2" />
            <span class="benefit-text">{{ benefit }}</span>
          </li>
        </ul>
      </div>

      <div class="actions-section">
        <button class="google-btn-primary" @click="updateDocs">
          Mettre à jour mes documents
        </button>
        <button class="google-btn-secondary" @click="goBack">
          Plus tard
        </button>
      </div>

      <div class="footer-section">
         <p>Un problème ? <NuxtLink to="/contact" class="google-link">Contacter le support</NuxtLink></p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Google App Style / Material Design 3 */
.google-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-family: 'Google Sans', 'Inter', Roboto, sans-serif;
  padding: 1.5rem;
  color: #1f1f1f;
}

.google-container {
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.icon-section {
  color: #0b57d0; /* Google Primary Blue */
  margin-bottom: 1.5rem;
}

.google-title {
  font-size: 2.25rem;
  font-weight: 400; /* Lighter weight typical of Google design */
  color: #1f1f1f; /* Almost Black */
  margin-bottom: 1rem;
  line-height: 1.2;
}

.google-subtitle {
  font-size: 1rem;
  line-height: 1.5;
  color: #444746;
  margin-bottom: 2.5rem;
}

.benefits-card {
  width: 100%;
  background-color: #f8fafd; /* Very light blue-grey */
  border-radius: 24px;
  padding: 1.5rem;
  text-align: left;
  margin-bottom: 2.5rem;
}

.benefits-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0b57d0;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.check-icon {
  color: #0b57d0;
  flex-shrink: 0;
}

.benefit-text {
  font-size: 1rem;
  color: #1f1f1f;
  font-weight: 400;
}

.actions-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 2.5rem;
}

.google-btn-primary {
  width: 100%;
  background-color: #0b57d0;
  color: #ffffff;
  border: none;
  border-radius: 9999px; /* Pill shape */
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.google-btn-primary:hover {
  background-color: #0842a0;
  box-shadow: 0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30);
}

.google-btn-secondary {
  width: 100%;
  background-color: transparent;
  color: #0b57d0;
  border: none;
  border-radius: 9999px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.google-btn-secondary:hover {
  background-color: rgba(11, 87, 208, 0.08);
}

.footer-section {
  font-size: 0.875rem;
  color: #444746;
}

.google-link {
  color: #0b57d0;
  text-decoration: none;
  font-weight: 500;
}

.google-link:hover {
  text-decoration: underline;
}
</style>
