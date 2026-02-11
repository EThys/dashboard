<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Check, X, ChevronLeft, ChevronRight, Loader2, 
  UserCheck, ShieldCheck, Mail, Phone, MapPin, Search, 
  Filter, RotateCcw, UserMinus, ShieldAlert
} from 'lucide-vue-next'
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Badge, Button, Input
} from '@/components/ui'
import { useAuthStore } from '~/stores/auth'
import { useMembersStore } from '~/stores/members'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

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
const searchQuery = ref('')
const filterCertification = ref('all') // 'all', 'certified', 'uncertified'
const filterPremium = ref('all') // 'all', 'premium', 'free'
const showAdmins = ref(false) // Filter for admins vs users
const currentPage = ref(1)
const itemsPerPage = 10

const fetchUsers = async () => {
  isLoading.value = true
  membersStore.setLoading(true)
  try {
    // Fetch all in parallel
    const [usersRes, membersRes, cardsRes]: any = await Promise.all([
      $fetch(`${config.public.apiBase}/users`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      }),
      $fetch(`${config.public.apiBase}/members`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      }),
      $fetch(`${config.public.apiBase}/cards`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    ])
    
    // Set Users
    if (usersRes && usersRes.data) {
      membersStore.setUsers(usersRes.data)
    } else if (Array.isArray(usersRes)) {
      membersStore.setUsers(usersRes)
    }

    // Set Members
    if (membersRes && membersRes.data) {
      membersStore.setMembers(membersRes.data)
    } else if (Array.isArray(membersRes)) {
      membersStore.setMembers(membersRes)
    }

    // Set Card Types
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

const toggleCertification = async (user: any) => {
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

// Check if a user is an admin (ID 18 or 19)
const checkIsAdmin = (userId: number) => {
    const member = membersStore.getMemberByUserId(userId)
    if (!member || !member.accounts) return false
    return member.accounts.some((acc: any) => acc.id === 18 || acc.id === 19)
}

const filteredUsers = computed(() => {
  let list = [...users.value]
  
  // Tri par ID décroissant (plus récent d'abord)
  list.sort((a, b) => b.userId - a.userId)

  // Admin filter (Exclusive)
  if (showAdmins.value) {
    // Show only admins
    list = list.filter(u => checkIsAdmin(u.userId))
  } else {
    // Show everyone EXCEPT admins
    list = list.filter(u => !checkIsAdmin(u.userId))
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(user => 
      (user.username?.toLowerCase().includes(query)) ||
      (user.email?.toLowerCase().includes(query)) ||
      (user.phone?.toLowerCase().includes(query)) ||
      (user.city?.toLowerCase().includes(query))
    )
  }
  
  // Certification filter
  if (filterCertification.value === 'certified') {
    list = list.filter(u => u.certified)
  } else if (filterCertification.value === 'uncertified') {
    list = list.filter(u => !u.certified)
  }
  
  // Premium filter
  if (filterPremium.value === 'premium') {
    list = list.filter(u => u.premium)
  } else if (filterPremium.value === 'free') {
    list = list.filter(u => !u.premium)
  }
  
  return list
})

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

watch([searchQuery, filterCertification, filterPremium, showAdmins], () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const resetFilters = () => {
    searchQuery.value = ''
    filterCertification.value = 'all'
    filterPremium.value = 'all'
    showAdmins.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
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

    <!-- Stats Cards -->
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

    <!-- Filter Toolbar -->
    <div class="bg-card p-4 rounded-xl border shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border self-start">
            <Button 
                variant="ghost" 
                size="sm" 
                :class="!showAdmins ? 'bg-white shadow-sm text-primary font-bold' : ''"
                @click="showAdmins = false"
                class="rounded-lg px-4"
            >
                Utilisateurs
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                :class="showAdmins ? 'bg-primary text-white shadow-md font-bold' : ''"
                @click="showAdmins = true"
                class="rounded-lg px-4"
            >
                <ShieldCheck class="h-4 w-4 mr-2" v-if="showAdmins" />
                Staff / Admins
            </Button>
        </div>

        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            v-model="searchQuery" 
            placeholder="Nom, email, téléphone ou ville..." 
            class="pl-9 h-11 border-muted bg-muted/20 focus:bg-background transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <select 
            v-show="!showAdmins"
            v-model="filterCertification"
            class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les statuts</option>
            <option value="certified">Certifiés seulement</option>
            <option value="uncertified">Non certifiés</option>
          </select>
          <select 
             v-show="!showAdmins"
            v-model="filterPremium"
            class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tout abonnement</option>
            <option value="premium">Membres Premium</option>
            <option value="free">Membres Gratuits</option>
          </select>
          <Button variant="ghost" size="icon" @click="resetFilters" title="Réinitialiser">
            <RotateCcw class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
          <TableHeader class="bg-muted/50">
            <TableRow>
              <TableHead class="w-[100px]">ID</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr v-if="isLoading">
              <td colspan="7" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center gap-2">
                  <Loader2 class="h-10 w-10 animate-spin text-primary" />
                  <span class="text-sm text-muted-foreground font-medium italic">Synchronisation avec le serveur...</span>
                </div>
              </td>
            </tr>
            
            <template v-else>
              <TableRow 
                v-for="user in paginatedUsers" 
                :key="user.userId" 
                class="hover:bg-muted/30 transition-colors group cursor-pointer"
                @click="router.push(`/dashboard/users/${user.userId}`)"
              >
                <TableCell class="font-mono text-[10px] text-muted-foreground">#{{ user.userId }}</TableCell>
                <TableCell>
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden">
                      <img v-if="user.certified && stats.premium" :src="`https://ui-avatars.com/api/?name=${user.username}&background=random`" class="h-full w-full object-cover opacity-50" />
                      <span v-else>{{ user.username?.substring(0, 2).toUpperCase().replace('@', '') }}</span>
                    </div>
                    <span class="font-bold text-foreground">{{ user.username }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex flex-col space-y-1">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail class="h-3 w-3" />
                      <span>{{ user.email || '—' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone class="h-3 w-3" />
                      <span>{{ user.phone && user.phone !== 'null' ? user.phone : '—' }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1.5 text-xs" v-if="user.city || user.country">
                    <MapPin class="h-3.5 w-3.5 text-blue-500/70" />
                    <span>{{ user.city }}{{ user.city && user.country ? ', ' : '' }}{{ user.country }}</span>
                  </div>
                  <span v-else class="text-xs text-muted-foreground italic">Inconnue</span>
                </TableCell>
                <TableCell>
                  <template v-if="checkIsAdmin(user.userId)">
                    <Badge v-if="membersStore.getMemberByUserId(user.userId)?.accounts?.some(a => a.id === 19)" variant="default" class="bg-purple-600 shadow-sm border-none">
                       Superadmin
                    </Badge>
                    <Badge v-else variant="default" class="bg-indigo-600 shadow-sm border-none">
                       Admin
                    </Badge>
                  </template>
                  <template v-else>
                    <Badge v-if="user.certified" variant="default" class="bg-green-600 hover:bg-green-700 shadow-sm border-none">
                      <UserCheck class="h-3 w-3 mr-1" /> Certifié
                    </Badge>
                    <Badge v-else variant="destructive" class="bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium">
                      <UserMinus class="h-3 w-3 mr-1" /> Non certifié
                    </Badge>
                  </template>
                </TableCell>
                <TableCell>
                  <div class="flex">
                    <template v-if="checkIsAdmin(user.userId)">
                        <span class="text-[10px] font-bold text-muted-foreground uppercase">Staff CasaNayo</span>
                    </template>
                    <template v-else>
                        <Badge v-if="user.premium" variant="default" class="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]">
                        <ShieldCheck class="h-3 w-3 mr-1" /> PREMIUM
                        </Badge>
                        <span v-else class="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40">Gratuit</span>
                    </template>
                  </div>
                </TableCell>
                <TableCell class="text-right px-4">
                  <template v-if="checkIsAdmin(user.userId)">
                    <Button 
                        variant="secondary" 
                        size="sm"
                        class="h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2"
                        @click.stop="toast.info('Gestion des rôles bientôt disponible')"
                    >
                        <ShieldCheck class="h-4 w-4" />
                        Editer Rôle
                    </Button>
                  </template>
                  <template v-else>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        :disabled="isUpdating === user.userId"
                        @click.stop="toggleCertification(user)"
                        :class="`${
                        user.certified 
                            ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                            : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white'
                        } h-9 w-full lg:w-32 transition-all font-bold`"
                    >
                        <Loader2 v-if="isUpdating === user.userId" class="h-4 w-4 animate-spin mr-2" />
                        <template v-else>
                        {{ user.certified ? 'Dé-certifier' : 'Certifier' }}
                        </template>
                    </Button>
                  </template>
                </TableCell>
              </TableRow>
              
              <TableRow v-if="filteredUsers.length === 0">
                <TableCell colspan="7" class="h-64 text-center">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                       <Search class="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-foreground font-black text-xl">Aucun utilisateur trouvé</p>
                      <p class="text-muted-foreground text-sm">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
                    </div>
                    <Button variant="secondary" @click="resetFilters" class="mt-4">
                      Réinitialiser tout
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
      </Table>
    </div>

    <!-- Enhanced Pagination -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4" v-if="totalPages > 1 && !isLoading">
      <div class="text-sm font-medium text-muted-foreground order-2 sm:order-1 flex items-center gap-2">
        <span class="bg-muted px-2 py-0.5 rounded text-foreground">{{ paginatedUsers.length }}</span> 
        sur 
        <span class="font-bold text-foreground">{{ filteredUsers.length }}</span> membres affichés
      </div>
      <div class="flex items-center space-x-2 order-1 sm:order-2 bg-card border p-1 rounded-xl shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="h-10 px-4"
        >
          <ChevronLeft class="h-4 w-4 mr-1" />
          Précédent
        </Button>
        <div class="flex items-center gap-1 px-4 text-sm font-black">
            <span class="text-primary">{{ currentPage }}</span>
            <span class="text-muted-foreground">/</span>
            <span>{{ totalPages }}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="h-10 px-4"
        >
          Suivant
          <ChevronRight class="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
</template>


