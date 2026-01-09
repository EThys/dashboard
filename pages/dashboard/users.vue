<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Badge, Button
} from '@/components/ui'

definePageMeta({
  layout: 'dashboard'
})

// Mock data
const users = ref([
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com', type: 'Particulier', date: '2023-10-25', status: 'Pending' },
  { id: 2, name: 'Marie Curie', email: 'marie.curie@example.com', type: 'Professionnel', date: '2023-10-26', status: 'Pending' },
  { id: 3, name: 'Pierre Martin', email: 'pierre.martin@example.com', type: 'Particulier', date: '2023-10-24', status: 'Pending' },
  { id: 4, name: 'Sophie Sophie', email: 'sophie.so@example.com', type: 'Professionnel', date: '2023-10-27', status: 'Rejected' },
  { id: 5, name: 'Lucas Modric', email: 'lucas.modric@example.com', type: 'Particulier', date: '2023-10-28', status: 'Pending' },
  { id: 6, name: 'Anna Polina', email: 'anna.polina@example.com', type: 'Professionnel', date: '2023-10-29', status: 'Active' },
])

const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return users.value.slice(start, end)
})

const approveUser = (id: number) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.status = 'Active'
}

const rejectUser = (id: number) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.status = 'Rejected'
}

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Active': return 'default' 
        case 'Rejected': return 'destructive'
        default: return 'secondary'
    }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Utilisateurs</h2>
        <p class="text-muted-foreground">Gérez les comptes utilisateurs de la plateforme.</p>
      </div>
    </div>

    <div class="rounded-md border bg-card">
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in paginatedUsers" :key="user.id">
              <TableCell class="font-medium">{{ user.name }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>
                <Badge variant="outline">{{ user.type }}</Badge>
              </TableCell>
              <TableCell>{{ user.date }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(user.status)">
                  {{ user.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2" v-if="user.status === 'Pending'">
                  <Button size="icon" class="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-200 shadow-sm" @click="approveUser(user.id)">
                    <Check class="h-4 w-4" />
                  </Button>
                  <Button size="icon" class="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-200 shadow-sm" @click="rejectUser(user.id)">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
             <TableRow v-if="users.length === 0">
              <TableCell colspan="6" class="h-24 text-center">
                Aucun utilisateur trouvé.
              </TableCell>
            </TableRow>
          </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-end space-x-2 py-4" v-if="totalPages > 1">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <ChevronLeft class="h-4 w-4 mr-2" />
        Précédent
      </Button>
      <div class="text-sm font-medium">
          Page {{ currentPage }} sur {{ totalPages }}
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Suivant
        <ChevronRight class="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>
</template>
