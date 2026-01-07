<script setup lang="ts">
import { ref } from 'vue'
import { Check, X } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

// Mock data
const users = ref([
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com', type: 'Particulier', date: '2023-10-25', status: 'Pending' },
  { id: 2, name: 'Marie Curie', email: 'marie.curie@example.com', type: 'Professionnel', date: '2023-10-26', status: 'Pending' },
  { id: 3, name: 'Pierre Martin', email: 'pierre.martin@example.com', type: 'Particulier', date: '2023-10-24', status: 'Pending' },
  { id: 4, name: 'Sophie Sophie', email: 'sophie.so@example.com', type: 'Professionnel', date: '2023-10-27', status: 'Rejected' },
])

const approveUser = (id: number) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.status = 'Active'
}

const rejectUser = (id: number) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.status = 'Rejected'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Comptes à Valider</h2>
    </div>

    <div class="rounded-md border bg-card">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date Inscription</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="user in users.filter(u => u.status === 'Pending')" :key="user.id" class="border-b transition-colors hover:bg-muted/50">
              <td class="p-4 align-middle font-medium">{{ user.name }}</td>
              <td class="p-4 align-middle">{{ user.email }}</td>
              <td class="p-4 align-middle">
                <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  :class="user.type === 'Professionnel' ? 'border-transparent bg-primary/20 text-primary' : 'border-transparent bg-secondary text-secondary-foreground'">
                  {{ user.type }}
                </span>
              </td>
              <td class="p-4 align-middle">{{ user.date }}</td>
              <td class="p-4 align-middle">
                <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
                  {{ user.status }}
                </span>
              </td>
              <td class="p-4 align-middle text-right">
                <div class="flex justify-end gap-2">
                  <button @click="approveUser(user.id)" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-200 bg-green-100 hover:bg-green-200 text-green-800 h-9 w-9">
                    <Check class="h-4 w-4" />
                    <span class="sr-only">Valider</span>
                  </button>
                  <button @click="rejectUser(user.id)" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-200 bg-red-100 hover:bg-red-200 text-red-800 h-9 w-9">
                    <X class="h-4 w-4" />
                    <span class="sr-only">Rejeter</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.filter(u => u.status === 'Pending').length === 0">
              <td colspan="6" class="p-4 text-center text-muted-foreground">Aucun utilisateur en attente validation.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
