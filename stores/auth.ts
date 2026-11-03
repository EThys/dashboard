import { defineStore } from 'pinia'
import { useMembersStore } from './members'
import { usePropertyStore } from './properties'
import { useServiceStore } from './services'
import { useCurrencyStore } from './currency'

interface User {
    userId: number
    email: string
    username: string
    phone: string
    city: string
    country: string
    certified: boolean
    premium: boolean
}

interface Account {
    id: number
    name: string
    typeAccount: {
        typeAccountId: number
        name: string
    }
}

interface Profile {
    id: number
    firstName: string
    lastName: string
    fullName: string
    address: string
    images: string
    cardFront: string
    cardBack: string
    numberCard: string
}

interface AuthState {
    user: User | null
    profile: Profile | null
    accounts: Account[]
    token: string | null
    isAuthenticated: boolean
}

interface LoginResponse {
    success: boolean
    message?: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        profile: null,
        accounts: [],
        token: null,
        isAuthenticated: false,
    }),
    getters: {
        isAdmin: (state) => {
            if (!state.accounts || state.accounts.length === 0) return false
            // Check if any account has id 18 (Admin) or 19 (Superadmin)
            return state.accounts.some(acc => acc.id === 18 || acc.id === 19)
        },
        /**
         * Compte gérant hôtel — l’API renvoie p.ex. `{ id: 3, name: "gerant", typeAccount: { typeAccountId: 2, name: "Proprietaire" } }`.
         * Le rôle se lit sur `name` du compte (`gerant`), pas sur typeAccountId (souvent 2 = propriétaire).
         */
        isGerant: (state) => {
            if (!state.accounts?.length) return false
            
            const normalize = (str: string | undefined): string => {
                return (str || '')
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .replace(/\s+/g, '')
                    .trim()
            }

            return state.accounts.some((acc) => {
                const nName = normalize(acc.name)
                const nTypeName = normalize(acc.typeAccount?.name)
                
                // UNIQUEMENT le mot "gerant" dans le name du compte.
                // NE PAS vérifier typeAccountId car 3 = "Prestataire de service" aussi.
                return nName === 'gerant' || nName.startsWith('gerant') || nTypeName === 'gerant'
            })
        },
    },
    actions: {
        async login(identifiant: string, password: string): Promise<LoginResponse> {
            const config = useRuntimeConfig()

            try {
                const res: any = await $fetch(`${config.public.authBase}/auth/login`, {
                    method: 'POST',
                    body: { identifiant, password }
                })

                if (res?.member && res?.token) {
                    this.setSession(res)
                    return { success: true }
                }

                return { success: false, message: 'Réponse invalide du serveur.' }

            } catch (error: any) {
                console.error('Login error:', error)

                let msg = 'Une erreur est survenue.'
                if (error.status === 401 || error.status === 403) {
                    msg = "Identifiants incorrects. Veuillez vérifier vos informations."
                } else if (error.data?.message) {
                    msg = error.data.message === "Invalid credentials."
                        ? "Identifiant ou mot de passe incorrect."
                        : error.data.message
                }

                return { success: false, message: msg }
            }
        },

        setSession(data: any) {
            this.user = data.member.user
            this.profile = data.member.profile
            this.accounts = data.member.accounts
            this.token = data.token
            this.isAuthenticated = true

            // Persist session in cookies
            const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            const userCookie = useCookie<any>('auth_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            const profileCookie = useCookie<any>('auth_profile', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            const accountsCookie = useCookie<any>('auth_accounts', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            
            tokenCookie.value = data.token
            userCookie.value = data.member.user
            profileCookie.value = data.member.profile
            accountsCookie.value = data.member.accounts
        },

        logout() {
            // Reset this store
            this.user = null
            this.profile = null
            this.accounts = []
            this.token = null
            this.isAuthenticated = false

            // Clear other stores
            const membersStore = useMembersStore()
            const propertyStore = usePropertyStore()
            const serviceStore = useServiceStore()
            const currencyStore = useCurrencyStore()

            membersStore.reset()
            propertyStore.reset()
            serviceStore.reset()
            currencyStore.reset()

            // Clear cookies
            const tokenCookie = useCookie('auth_token', { path: '/' })
            const userCookie = useCookie('auth_user', { path: '/' })
            const profileCookie = useCookie('auth_profile', { path: '/' })
            const accountsCookie = useCookie('auth_accounts', { path: '/' })
            
            tokenCookie.value = null
            userCookie.value = null
            profileCookie.value = null
            accountsCookie.value = null

            return navigateTo('/login')
        },

        // Helper to check if we have a valid session on load
        setPremium(premium: boolean) {
            if (!this.user) return
            this.user = { ...this.user, premium }
            const userCookie = useCookie<any>('auth_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            userCookie.value = this.user
        },

        updateMember(patch: { user?: Partial<User>; profile?: Partial<Profile> }) {
            if (patch.user && this.user) this.user = { ...this.user, ...patch.user }
            if (patch.profile && this.profile) this.profile = { ...this.profile, ...patch.profile }
            const userCookie = useCookie<any>('auth_user', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            const profileCookie = useCookie<any>('auth_profile', { maxAge: 60 * 60 * 24 * 7, path: '/' })
            userCookie.value = this.user
            profileCookie.value = this.profile
        },

        checkSession() {
            const token = useCookie('auth_token').value
            const userCookie = useCookie<any>('auth_user').value
            const profileCookie = useCookie<any>('auth_profile').value
            const accountsCookie = useCookie<any>('auth_accounts').value

            if (token) {
                this.token = token
                this.isAuthenticated = true
                
                // Restore User
                if (userCookie) {
                    try {
                        this.user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie
                    } catch (e) {
                        this.user = userCookie
                    }
                }

                // Restore Profile
                if (profileCookie) {
                    try {
                        this.profile = typeof profileCookie === 'string' ? JSON.parse(profileCookie) : profileCookie
                    } catch (e) {
                        this.profile = profileCookie
                    }
                }

                // Restore Accounts
                if (accountsCookie) {
                    try {
                        this.accounts = typeof accountsCookie === 'string' ? JSON.parse(accountsCookie) : accountsCookie
                    } catch (e) {
                        this.accounts = accountsCookie
                    }
                }
                
                return true
            }
            
            // Cleanup state if no token cookie exists
            if (this.token || this.isAuthenticated) {
                this.token = null
                this.user = null
                this.profile = null
                this.accounts = []
                this.isAuthenticated = false
            }
            
            return false
        }
    }
})
