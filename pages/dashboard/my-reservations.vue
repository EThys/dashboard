<script setup lang="ts">
import { useReservationStore } from '@/stores/reservations'
import { Calendar, Clock, MapPin, Tag, ArrowRight, Loader2, Home } from 'lucide-vue-next'
import { Badge, Card, CardHeader, CardTitle, CardContent, Button as UiButton } from '@/components/ui'

definePageMeta({
  layout: 'dashboard'
})

const resStore = useReservationStore()
const { data: reservations, pending: isLoading, refresh } = await useAsyncData(
    'my-reservations',
    () => resStore.fetchUserReservations(),
    { server: false }
)

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200'
        case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
}

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    } catch (e) {
        return dateStr
    }
}
</script>

<template>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="space-y-1">
                <h1 class="text-4xl font-black tracking-tight italic text-foreground">Mes Réservations</h1>
                <p class="text-muted-foreground font-medium text-lg">Gérez vos visites et réservations CasaNayo.</p>
            </div>
            <button 
                @click="refresh()" 
                class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all font-bold text-sm"
            >
                <Loader2 v-if="isLoading" class="size-4 animate-spin text-primary" />
                Actualiser la liste
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !reservations" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-border"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!reservations || reservations.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-border/50 text-center px-6">
            <div class="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Calendar class="size-10 text-primary opacity-40" />
            </div>
            <h3 class="text-2xl font-black text-foreground mb-2 italic">Aucune réservation pour le moment</h3>
            <p class="text-muted-foreground max-w-sm font-medium mb-8">Parcourez nos propriétés et réservez votre prochaine visite en un clic.</p>
            <NuxtLink to="/properties">
                <UiButton class="rounded-2xl h-14 px-8 font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20">Explorer les biens</UiButton>
            </NuxtLink>
        </div>

        <!-- List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            <div 
                v-for="res in reservations" 
                :key="res.id"
                class="group relative bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
                <!-- Status Badge Overlay -->
                <div class="absolute top-6 right-6 z-10">
                    <Badge :class="`rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase border-2 ${getStatusColor(res.status)}`">
                        {{ res.status }}
                    </Badge>
                </div>

                <div class="p-8 space-y-6">
                    <!-- Icon & Type -->
                    <div class="flex items-center gap-4">
                        <div class="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                            <Home v-if="res.propertyId" class="size-6" />
                            <Clock v-else class="size-6" />
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-primary uppercase tracking-widest">Type: {{ res.type }}</p>
                            <h3 class="text-xl font-bold text-foreground leading-tight line-clamp-1">Ref: #{{ res.id }}</h3>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-4 pt-2">
                        <div class="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <div class="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <Calendar class="size-4 text-slate-500" />
                            </div>
                            <span>Du {{ formatDate(res.startDate) }}</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <div class="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <Clock class="size-4 text-slate-500" />
                            </div>
                            <span>{{ res.reservationHeure || 'Heure non précisée' }}</span>
                        </div>
                    </div>

                    <!-- Message Preview -->
                    <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                        <p class="text-xs text-slate-500 font-medium italic line-clamp-2">"{{ res.message || 'Aucun message particulier.' }}"</p>
                    </div>

                    <!-- Action -->
                    <div class="pt-4">
                        <button class="w-full h-12 rounded-xl border-2 border-slate-100 font-bold text-sm text-slate-400 group-hover:border-primary/20 group-hover:text-primary transition-all flex items-center justify-center gap-2">
                            Voir plus de détails
                            <ArrowRight class="size-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
