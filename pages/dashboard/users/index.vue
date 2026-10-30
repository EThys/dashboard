<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Check, Loader2,
  UserCheck, ShieldCheck,
  RotateCcw, ShieldAlert
} from 'lucide-vue-next'
import { Badge, Button } from '@/components/ui'
import { process } from '@progress/kendo-data-query'
import type { State } from '@progress/kendo-data-query'
import { useAuthStore } from '~/stores/auth'
import { useMembersStore } from '~/stores/members'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

const router = useRouter()

definePageMeta({
  layout: 'dashboard'
})
const auth = useAuthStore()
const membersStore = useMembersStore()
const config = useRuntimeConfig()

const users = computed(() => membersStore.users)
const isLoading = ref(true)
const isUpdating = ref<number | null>(null)
const showAdmins = ref(false)
const dataState = ref<State>({
  skip: 0,
  take: 10,
  sort: [{ field: 'userId', dir: 'desc' }],
})

const fetchUsers = async () => {
  isLoading.value = true
  membersStore.setLoading(true)
  try {
    const apiBase = config.public.apiBase as string
    const authH = { Authorization: `Bearer ${auth.token}` }
    const [usersRes, membersRes, cardsRes]: any = await Promise.all([
      $fetch(joinApi(apiBase, ApiEndpoints.allUsers), { headers: authH }),
      $fetch(joinApi(apiBase, ApiEndpoints.protectedMembers), { headers: authH }),
      $fetch(joinApi(apiBase, ApiEndpoints.cards), { headers: authH }),
    ])

    if (usersRes && usersRes.data) {
      membersStore.setUsers(usersRes.data)
    } else if (Array.isArray(usersRes)) {
      membersStore.setUsers(usersRes)
    }

    if (membersRes && membersRes.data) {
      membersStore.setMembers(membersRes.data)
    } else if (Array.isArray(membersRes)) {
      membersStore.setMembers(membersRes)
    }

    if (cardsRes && cardsRes.data) {
      membersStore.setCardTypes(cardsRes.data)
    } else if (Array.isArray(cardsRes)) {
      membersStore.setCardTypes(cardsRes)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Erreur lors du chargement des données')
  } finally {
    isLoading.value = false
    membersStore.setLoading(false)
  }
}

const toggleCertification = async (user: { userId: number; certified?: boolean }) => {
  isUpdating.value = user.userId
  const newStatus = !user.certified
  const result = await membersStore.certifyUser(user.userId, newStatus)

  if (result.success) {
    toast.success(newStatus ? 'Utilisateur certifié avec succès' : 'Certification retirée')
  } else {
    toast.error('Erreur lors de la modification du statut')
  }

  isUpdating.value = null
}

const checkIsAdmin = (userId: number) => {
  const member = membersStore.getMemberByUserId(userId)
  if (!member || !member.accounts) return false
  return member.accounts.some((acc: any) => acc.id === 18 || acc.id === 19)
}

const gridSource = computed(() => {
  const list = users.value.filter((user) => showAdmins.value ? checkIsAdmin(user.userId) : !checkIsAdmin(user.userId))
  return list.map((user) => ({
    ...user,
    contact: [user.email, user.phone && user.phone !== 'null' ? user.phone : ''].filter(Boolean).join(' · ') || '—',
    location: [user.city, user.country].filter(Boolean).join(', ') || 'Inconnue',
    statut: checkIsAdmin(user.userId) ? 'Admin' : (user.certified ? 'Certifié' : 'Non certifié'),
    abonnement: checkIsAdmin(user.userId) ? 'Staff' : (user.premium ? 'Premium' : 'Gratuit'),
    busy: isUpdating.value === user.userId,
  }))
})

const gridData = computed(() => process(gridSource.value, dataState.value))

function onDataStateChange(event: { data: State }) {
  dataState.value = event.data
}

function onRowClick(event: { dataItem: { userId: number }; event?: Event }) {
  const target = event.event?.target as HTMLElement | undefined
  if (target?.closest('button')) return
  router.push(`/dashboard/users/${event.dataItem.userId}`)
}

function actionsCell(h: any, _defaultRendering: unknown, cellProps: { dataItem: { userId: number; certified?: boolean; busy?: boolean }; className?: string }) {
  const user = cellProps.dataItem
  if (checkIsAdmin(user.userId)) {
    return h('td', { class: cellProps.className }, 'Staff')
  }
  return h('td', { class: cellProps.className }, [
    h('button', {
      class: 'k-button',
      attrs: { type: 'button', disabled: user.busy },
      on: {
        click: (clickEvent: Event) => {
          clickEvent.stopPropagation()
          toggleCertification(user)
        },
      },
    }, user.busy ? '…' : (user.certified ? 'Dé-certifier' : 'Certifier')),
  ])
}

const columns = [
  { field: 'userId', title: 'ID', width: '90px', filter: 'numeric' },
  { field: 'username', title: 'Utilisateur' },
  { field: 'contact', title: 'Contact' },
  { field: 'location', title: 'Localisation' },
  { field: 'statut', title: 'Statut', width: '150px' },
  { field: 'abonnement', title: 'Premium', width: '140px' },
  { title: 'Actions', width: '150px', filterable: false, sortable: false, cell: actionsCell },
]

const stats = computed(() => {
  const allUsers = users.value
  const adminUsers = allUsers.filter(u => checkIsAdmin(u.userId))
  const regularUsers = allUsers.filter(u => !checkIsAdmin(u.userId))

  return {
    total: regularUsers.length,
    admins: adminUsers.length,
    certified: regularUsers.filter(u => u.certified).length,
    uncertified: regularUsers.filter(u => !u.certified).length,
    premium: regularUsers.filter(u => u.premium).length
  }
})

onMounted(() => {
  fetchUsers()
})

watch(showAdmins, () => {
  dataState.value = { ...dataState.value, skip: 0 }
})

const resetFilters = () => {
  showAdmins.value = false
  dataState.value = { skip: 0, take: 10, sort: [{ field: 'userId', dir: 'desc' }] }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-black tracking-tight flex items-center gap-3">
          Utilisateurs
          <Badge variant="outline" class="font-mono">{{ stats.total }}</Badge>
        </h2>
        <p class="text-muted-foreground mt-1 text-sm lg:text-base">Gérez les certifications et analysez votre base d'utilisateurs.</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="fetchUsers" :disabled="isLoading" class="shadow-sm">
          <RotateCcw v-if="!isLoading" class="mr-2 h-4 w-4" />
          <Loader2 v-else class="mr-2 h-4 w-4 animate-spin" />
          Actualiser
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          <UserCheck class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Utilisateurs</p>
          <p class="text-2xl font-black">{{ stats.total }}</p>
        </div>
      </div>
      <div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4 border-primary/20 bg-primary/[0.02]">
        <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-primary">Admins</p>
          <p class="text-2xl font-black text-primary">{{ stats.admins }}</p>
        </div>
      </div>
      <div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
          <Check class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Certifiés</p>
          <p class="text-2xl font-black">{{ stats.certified }}</p>
        </div>
      </div>
      <div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
          <ShieldAlert class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-red-500">Non Certifiés</p>
          <p class="text-2xl font-black text-red-600">{{ stats.uncertified }}</p>
        </div>
      </div>
      <div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
          <Badge variant="outline" class="border-amber-200 text-amber-700 bg-amber-50">VIP</Badge>
        </div>
        <div>
          <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Premium</p>
          <p class="text-2xl font-black">{{ stats.premium }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button type="button" size="sm" :variant="!showAdmins ? 'default' : 'outline'" @click="showAdmins = false">Utilisateurs</Button>
      <Button type="button" size="sm" :variant="showAdmins ? 'default' : 'outline'" @click="showAdmins = true">Staff / Admins</Button>
      <Button type="button" size="sm" variant="ghost" class="ml-auto" @click="resetFilters">Réinitialiser les filtres</Button>
    </div>

    <div v-if="isLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 class="h-4 w-4 animate-spin" />
      Synchronisation avec le serveur...
    </div>

    <ClientOnly>
      <KendoGrid
        :data-items="gridData.data"
        :total="gridData.total"
        :skip="dataState.skip"
        :take="dataState.take"
        :sort="dataState.sort"
        :filter="dataState.filter"
        :columns="columns"
        :pageable="{ buttonCount: 5, pageSizes: [10, 20, 50], info: true }"
        :sortable="true"
        :filterable="true"
        :resizable="true"
        :reorderable="true"
        @datastatechange="onDataStateChange"
        @rowclick="onRowClick"
      />
    </ClientOnly>
  </div>
</template>
