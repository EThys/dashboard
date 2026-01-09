<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { LayoutDashboard, Users, FileText, Settings, LogOut, Bell, Search, Menu } from 'lucide-vue-next'
import { Button, Sheet } from '@/components/ui'

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Publications', path: '/dashboard/publications', icon: FileText },
  { name: 'Utilisateurs', path: '/dashboard/users', icon: Users },
  { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
]

function isItemActive(path: string) {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}

// Time Logic
const currentTime = ref('')
let timer: any

const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    })
}

// Mock User
const user = ref({
    name: 'Muzola Ethberg',
    role: 'Administrateur',
    avatar: 'https://github.com/shadcn.png'
})

const handleLogout = () => {
    // Add actual logout logic here (clear tokens, etc.)
    router.push('/login')
}

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>

<template>
  <div class="flex h-screen bg-background font-sans overflow-hidden cursor-default">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-border bg-card hidden md:flex flex-col z-20">
      <div class="p-6 flex items-center gap-3 border-b border-border h-20">
        <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span class="text-primary font-black text-xl">C</span>
        </div>
        <div class="flex flex-col">
            <span class="font-bold text-lg tracking-tight leading-none">CasaNayo</span>
            <span class="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Dashboard</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <NuxtLink
          v-for="item in sidebarItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-bold transition-all duration-200 group relative',
            isItemActive(item.path)
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
        >
          <div v-if="isItemActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>
          <component :is="item.icon" :class="['size-5', isItemActive(item.path) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground']" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-border bg-muted/10">
        <Button @click="handleLogout" variant="ghost" class="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold">
          <LogOut class="size-5" />
          Déconnexion
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-muted/20">
      <!-- Header -->
      <header class="h-20 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div class="md:hidden flex items-center gap-3">
            <Sheet v-model:open="isMobileMenuOpen">
                <Button variant="ghost" size="icon" @click="isMobileMenuOpen = true">
                    <Menu class="size-6 text-muted-foreground" />
                </Button>
                <template #content>
                    <div class="flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-8">
                            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span class="text-primary font-black text-xl">C</span>
                            </div>
                            <span class="font-bold text-lg tracking-tight">CasaNayo</span>
                        </div>
                        <nav class="flex-1 space-y-2">
                             <NuxtLink
                                v-for="item in sidebarItems"
                                :key="item.path"
                                :to="item.path"
                                @click="isMobileMenuOpen = false"
                                :class="[
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200',
                                    isItemActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                ]"
                                >
                                <component :is="item.icon" class="size-5" />
                                {{ item.name }}
                            </NuxtLink>
                        </nav>
                         <div class="mt-auto pt-4 border-t border-border">
                            <Button @click="handleLogout" variant="ghost" class="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold">
                                <LogOut class="size-5" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </template>
            </Sheet>
            <span class="font-bold text-lg">CasaNayo</span>
        </div>

        <div class="hidden md:flex items-center gap-4 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
             <Search class="size-4" />
             <input type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-muted-foreground/70" />
        </div>

        <div class="flex items-center gap-6 ml-auto">
             <!-- Time Display -->
             <div class="hidden lg:flex flex-col items-end mr-2">
                <span class="text-2xl font-black text-foreground leading-none tracking-tight">{{ currentTime }}</span>
                <span class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }) }}</span>
             </div>

             <div class="h-8 w-[1px] bg-border hidden lg:block"></div>

             <Button variant="ghost" size="icon" class="relative rounded-full hover:bg-muted">
                <Bell class="size-5 text-muted-foreground" />
                <span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card"></span>
             </Button>
             
             <!-- User Profile -->
             <div class="flex items-center gap-3 pl-2">
                <div class="flex flex-col items-end hidden md:flex">
                    <span class="text-sm font-bold text-foreground">{{ user.name }}</span>
                    <span class="text-[10px] font-medium text-muted-foreground">{{ user.role }}</span>
                </div>
                <div class="size-10 rounded-full bg-primary/20 p-1 ring-2 ring-primary/20 ring-offset-2 ring-offset-card cursor-pointer transition-all hover:ring-primary/50">
                    <img :src="user.avatar" alt="Avatar" class="h-full w-full rounded-full object-cover" />
                </div>
             </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <slot />
        </div>
      </main>
    </div>
  </div>
</template>
