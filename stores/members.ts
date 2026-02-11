import { defineStore } from 'pinia'

interface User {
  userId: number
  email: string | null
  username: string
  phone: string | null
  city: string
  country: string
  certified: boolean
  premium: boolean
}

interface TypeAccount {
  typeAccountId: number
  name: string
}

interface Account {
  id: number
  name: string
  typeAccount: TypeAccount
}

interface Member {
  id: number
  userId: number
  firstName: string
  lastName: string
  fullName: string
  address: string
  images: string
  cardFront: string
  cardBack: string
  numberCard: string
  typeCardId: number
  accounts?: Account[]
}

interface CardType {
  typeCardId: number
  name: string
}

export const useMembersStore = defineStore('members', {
  state: () => ({
    users: [] as User[],
    members: [] as Member[],
    cardTypes: [] as CardType[],
    isLoading: false,
  }),
  
  getters: {
    getUserById: (state) => (id: number | string) => {
      return state.users.find(u => u.userId.toString() === id.toString())
    },
    getMemberById: (state) => (id: number | string) => {
      return state.members.find(m => m.id.toString() === id.toString())
    },
    getMemberByUserId: (state) => (userId: number | string) => {
      return state.members.find(m => m.userId.toString() === userId.toString())
    },
    getCardTypeName: (state) => (typeId: number) => {
      if (typeId === 2) return 'Passeport'
      const type = state.cardTypes.find(t => t.typeCardId === typeId)
      return type ? type.name : 'Inconnu'
    }
  },
  
  actions: {
    setUsers(users: User[]) {
      this.users = users
    },
    setMembers(members: Member[]) {
      this.members = members
    },
    setCardTypes(types: CardType[]) {
      this.cardTypes = types
    },
    setLoading(status: boolean) {
      this.isLoading = status
    },
    updateUserCertification(userId: number, status: boolean) {
      const user = this.users.find(u => u.userId === userId)
      if (user) {
        user.certified = status
      }
    },
    async certifyUser(userId: number, status: boolean) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()
      
      try {
        await $fetch(`${config.public.apiBase}/certification/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${auth.token}`
          },
          body: {
            state: status
          }
        })
        
        this.updateUserCertification(userId, status)
        return { success: true }
      } catch (error) {
        console.error('Certification error:', error)
        return { success: false, error }
      }
    },
    reset() {
      this.users = []
      this.members = []
      this.isLoading = false
    }
  }
})
