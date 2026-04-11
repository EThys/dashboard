<script setup lang="ts">
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard, 
  Calendar, 
  ChevronRight,
  Trash2,
  Inbox,
  ArrowLeft,
  Circle,
  Loader2
} from 'lucide-vue-next'
import { Button, Badge } from '@/components/ui'
import { useNotificationStore, type AppNotification } from '@/stores/notifications'
import { toast } from 'vue-sonner'

definePageMeta({
    layout: 'default',
})

useHead({
    title: 'Mes Notifications | CasaNayo',
})

const notifStore = useNotificationStore()

onMounted(() => {
    notifStore.fetchNotifications(true)
})

const loading = computed(() => notifStore.loading)
const notifications = computed(() => notifStore.notifications)
const unreadCount = computed(() => notifStore.unreadCount)
const hasMore = computed(() => notifStore.hasMore)
const loadingMore = ref(false)

function getIcon(type: string, tag?: string) {
    const t = type.toUpperCase()
    const g = (tag || '').toUpperCase()
    
    if (g.includes('PAYMENT') || g.includes('SUBSCRIPTION')) return CreditCard
    if (g.includes('RESERVATION') || g.includes('APPOINTMENT')) return Calendar
    if (t === 'SUCCESS') return CheckCircle2
    if (t === 'ERROR' || t === 'DANGER') return XCircle
    if (t === 'WARNING') return Clock
    return Bell
}

function getIconColor(type: string, tag?: string) {
    const t = type.toUpperCase()
    const g = (tag || '').toUpperCase()
    
    if (g.includes('CANCELED') || t === 'ERROR') return 'text-red-500 bg-red-50 border-red-100'
    if (g.includes('SUCCESS') || t === 'SUCCESS') return 'text-emerald-500 bg-emerald-50 border-emerald-100'
    if (g.includes('PAYMENT') || g.includes('SUBSCRIPTION')) return 'text-blue-500 bg-blue-50 border-blue-100'
    if (t === 'WARNING') return 'text-amber-500 bg-amber-50 border-amber-100'
    return 'text-slate-500 bg-slate-50 border-slate-100'
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 30000) return "À l'instant"
    if (diff < 60000) return "Il y a moins d'une minute"
    
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `Il y a ${minutes} min`
    
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `Il y a ${hours} h`
    
    const days = Math.floor(diff / 86400000)
    if (days === 1) return `Hier`
    if (days < 7) return `Il y a ${days} j`
    
    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `Il y a ${weeks} sem`
    
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

async function handleMarkRead(id: number) {
    await notifStore.markAsRead(id)
}

async function handleDelete(id: number) {
    await notifStore.deleteNotification(id)
    toast.success('Notification supprimée')
}

async function handleMarkAllRead() {
    await notifStore.markAllRead()
    toast.success('Toutes les notifications ont été marquées comme lues')
}

async function handleLoadMore() {
    loadingMore.value = true
    await notifStore.fetchNotifications()
    loadingMore.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] pb-20">
    <!-- Header -->
    <header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft class="size-5" />
          </NuxtLink>
          <h1 class="text-xl font-black tracking-tight text-slate-900">Notifications</h1>
        </div>
        
        <Button 
          v-if="unreadCount > 0"
          variant="ghost" 
          size="sm" 
          class="text-xs font-bold text-[#1976D2] hover:bg-blue-50"
          @click="handleMarkAllRead"
        >
          Tout marquer comme lu
        </Button>
      </div>
    </header>

    <main class="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
      <!-- State: Loading -->
      <div v-if="loading && notifications.length === 0" class="flex flex-col items-center justify-center py-20">
         <div class="relative mb-6">
            <div class="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
            <div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
               <Bell class="size-8 animate-bounce text-[#1976D2]" />
            </div>
         </div>
         <p class="font-bold text-slate-600">Recherche de nouvelles notifications...</p>
      </div>

      <!-- State: Empty -->
      <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-24 text-center">
         <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <Inbox class="size-10 text-slate-300" />
         </div>
         <h2 class="text-xl font-bold text-slate-900">Votre boîte est vide</h2>
         <p class="mx-auto mt-2 max-w-xs text-sm text-slate-500">
            Vous n'avez pas encore de notifications. Les activités importantes s'afficheront ici.
         </p>
         <NuxtLink to="/properties" class="mt-8">
            <Button class="rounded-xl bg-[#1976D2] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700">
               Explorer les propriétés
            </Button>
         </NuxtLink>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
         <div v-if="unreadCount > 0" class="mb-4 px-2">
            <Badge variant="secondary" class="bg-blue-50 font-bold text-[#1976D2]">
               {{ unreadCount }} nouvelle{{ unreadCount > 1 ? 's' : '' }}
            </Badge>
         </div>

         <div 
            v-for="notif in notifications" 
            :key="notif.id"
            class="group relative flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5"
            :class="{'bg-blue-50/30 border-blue-100/50 shadow-sm': !notif.read}"
            @click="handleMarkRead(notif.id)"
         >
            <!-- Badge de non-lu -->
            <div v-if="!notif.read" class="absolute left-2 top-1/2 -translate-y-1/2">
                <Circle class="size-2 fill-[#1976D2] text-[#1976D2]" />
            </div>

            <!-- Icon -->
            <div 
               class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110"
               :class="getIconColor(notif.type, notif.tag)"
            >
               <component :is="getIcon(notif.type, notif.tag)" class="size-6" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
               <div class="flex items-start justify-between gap-2">
                  <h3 class="text-base font-extrabold text-slate-900 leading-tight" :class="{'text-[#1976D2]': !notif.read}">
                     {{ notif.title }}
                  </h3>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                     {{ formatDate(notif.createdAt) }}
                  </span>
               </div>
               <p class="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {{ notif.content || notif.description }}
               </p>
               
               <div class="mt-4 flex items-center gap-3">
                  <Badge v-if="notif.tag" variant="outline" class="text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400">
                     {{ notif.tag }}
                  </Badge>
                  <button 
                     @click.stop="handleDelete(notif.id)"
                     class="ml-auto opacity-0 transition-opacity group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500"
                  >
                     <Trash2 class="size-4" />
                  </button>
               </div>
            </div>
            
            <div class="flex items-center self-center pl-2">
               <ChevronRight class="size-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#1976D2]" />
            </div>
         </div>
      </div>
      
      <!-- Load more button -->
      <div v-if="hasMore && notifications.length > 0" class="mt-10 flex justify-center pb-10">
         <Button 
            variant="outline" 
            class="rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all hover:px-8"
            :disabled="loadingMore"
            @click="handleLoadMore"
         >
            <Loader2 v-if="loadingMore" class="mr-2 size-4 animate-spin" />
            Afficher plus de notifications
         </Button>
      </div>
      <div v-else-if="notifications.length > 0" class="mt-10 pb-10 text-center">
         <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Fin des notifications</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
