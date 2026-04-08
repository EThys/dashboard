import { useAuthStore } from '@/stores/auth'

export type ReservationBlockCode = 'NOT_CERTIFIED' | 'NOT_PREMIUM'

export interface ReservationEligibility {
    ok: boolean
    certified: boolean
    premium: boolean
    code?: ReservationBlockCode
    message?: string
}

/** Profil validé (certifié) et abonnement actif (premium), aligné API web + champs type isCertified / isPremium. */
export function getUserCertified(user: Record<string, unknown> | null | undefined): boolean {
    if (!user) return false
    const v = user.certified ?? user.isCertified
    return v === true || v === 'true' || v === 1
}

export function getUserPremium(user: Record<string, unknown> | null | undefined): boolean {
    if (!user) return false
    const v = user.premium ?? user.isPremium
    return v === true || v === 'true' || v === 1
}

export function evaluateReservationEligibility(user: Record<string, unknown> | null | undefined): ReservationEligibility {
    const certified = getUserCertified(user)
    const premium = getUserPremium(user)
    if (certified && premium) {
        return { ok: true, certified, premium }
    }
    if (!certified) {
        return {
            ok: false,
            certified,
            premium,
            code: 'NOT_CERTIFIED',
            message:
                'Votre profil doit être certifié (pièce d’identité validée) avant de pouvoir réserver un bien.',
        }
    }
    return {
        ok: false,
        certified,
        premium,
        code: 'NOT_PREMIUM',
        message:
            'Un abonnement CasaNayo Premium (5 $ US / an) est requis pour effectuer une réservation. Souscrivez depuis votre espace.',
    }
}

export function useReservationEligibility() {
    const auth = useAuthStore()
    const eligibility = computed(() => evaluateReservationEligibility(auth.user as Record<string, unknown> | null))

    return {
        eligibility,
        evaluate: () => evaluateReservationEligibility(auth.user as Record<string, unknown> | null),
    }
}
