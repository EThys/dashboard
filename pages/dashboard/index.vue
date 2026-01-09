<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { Users, FileText, Activity, DollarSign, ArrowUpRight } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

definePageMeta({
  layout: 'dashboard'
})

const auth = useAuthStore()

const stats = [
  {
    title: 'Utilisateurs Totaux',
    value: '1,234',
    icon: Users,
    change: '+20.1% par rapport au mois dernier',
    iconClass: 'text-muted-foreground'
  },
  {
    title: 'Publications Actives',
    value: '+573',
    icon: FileText,
    change: '+201 depuis la semaine dernière',
    iconClass: 'text-muted-foreground'
  },
  {
    title: 'Revenus (Est.)',
    value: '$45,231.89',
    icon: DollarSign,
    change: '+19% par rapport au mois dernier',
    iconClass: 'text-muted-foreground'
  },
  {
    title: 'Activité',
    value: '+573',
    icon: Activity,
    change: '+201 depuis l\'heure dernière',
    iconClass: 'text-muted-foreground'
  }
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Tableau de bord</h2>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="(stat, index) in stats" :key="index">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ stat.title }}
          </CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stat.change }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity / Overview Placeholder -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
        </CardHeader>
        <CardContent class="pl-2">
          <div class="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
             Graphique d'activité (Placeholder)
          </div>
        </CardContent>
      </Card>
      
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Récemment Inscrits</CardTitle>
          <p class="text-sm text-muted-foreground">
            Vous avez fait 265 ventes ce mois-ci.
          </p>
        </CardHeader>
        <CardContent>
          <div class="space-y-8">
            <div class="flex items-center">
              <span class="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                <div class="flex h-full w-full items-center justify-center rounded-full bg-muted">JD</div>
              </span>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">John Doe</p>
                <p class="text-sm text-muted-foreground">john.doe@email.com</p>
              </div>
              <div class="ml-auto font-medium">+$1,999.00</div>
            </div>
             <div class="flex items-center">
              <span class="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                <div class="flex h-full w-full items-center justify-center rounded-full bg-muted">JL</div>
              </span>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">Jackson Lee</p>
                <p class="text-sm text-muted-foreground">jackson.lee@email.com</p>
              </div>
              <div class="ml-auto font-medium">+$39.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

