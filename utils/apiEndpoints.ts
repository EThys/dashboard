/**
 * Miroir de casaRevolution/lib/utils/Endpoints.dart
 * Base API : https://migration.casanayo.com/api/ (voir nuxt.config + proxy)
 */
export const API_VERSION = 'v1' as const

const v = API_VERSION

/** Concatène apiBase (ex. /api ou https://migration.casanayo.com/api) et un chemin sans slash initial superflu */
export function joinApi(apiBase: string, path: string): string {
    const b = apiBase.replace(/\/+$/, '')
    const p = path.replace(/^\/+/, '')
    return `${b}/${p}`
}

/**
 * Tous les chemins relatifs à la racine `/api` (sans slash de début),
 * identiques à Endpoints.dart avec $version → v1.
 */
export const ApiEndpoints = {
    // Auth / membres
    register: `${v}/public/members`,
    /** Liste utilisateurs (dashboard admin) — Bearer obligatoire */
    allUsers: `${v}/protected/users`,
    login: 'login',
    refreshToken: `${v}/protected/token/refresh`,
    forgotPassword: 'forgot-password',
    resetPassword: `${v}/protected/reset/password`,
    updateProfilePicture: `${v}/protected/members`,
    protectedMembers: `${v}/protected/members`,
    certification: `${v}/protected/certification/`,

    otpGenerate: `${v}/public/otp/generate`,
    otpVerify: `${v}/public/otp/verify`,
    resetPasswordEndpoint: `${v}/protected/reset/password`,
    profile: 'profile',
    updateProfile: 'profile',
    logout: 'logout',
    changePassword: `${v}/protected/change/password`,
    deleteAccount: 'delete/user',
    accounts: `${v}/public/accounts`,
    accountTypes: `${v}/public/accounts/type`,

    bailleur: 'bailleurs',
    commissionnaire: 'commissionnaires',
    locataire: 'locataires',
    majordomes: 'majordomes',
    plombiers: 'plombiers',
    electriciens: 'electriciens',
    salubrites: 'salubrites',
    peintres: 'peintres',
    carreleurs: 'carreleurs',
    menuisiers: 'menuisiers',
    frigoristes: 'frigoristes',
    ajusteurs: 'ajusteurs',
    architectes: 'architectes',
    chauffeurs: 'chauffeurs',
    demenagements: 'demenagements',

    countries: `${v}/public/countries`,
    cities: `${v}/public/cities`,
    communes: `${v}/public/communes`,
    districts: `${v}/public/districts`,
    quartiers: `${v}/public/quartiers`,

    /** Liste publique des biens */
    properties: `${v}/public/property`,
    /** Liste + détail par id — dashboard admin (`GET …/protected/property` ou `…/protected/property/{propertyId}`, Bearer) */
    protectedProperties: `${v}/protected/property`,
    propertyDetailPrefix: 'properties/',
    storeProperty: `${v}/private/property`,
    updatePropertyPrefix: 'properties/',
    deletePropertyPrefix: 'properties/',
    propertiesByOwner: `${v}/private/property/owner/`,
    propertyBureaux: `${v}/public/property/bureaux`,
    protectedPropertyBureaux: `${v}/protected/property/bureaux`,
    /** Détail bureau (admin) — `GET …/protected/property/bureaux/{propertyId}`, Bearer */
    protectedPropertyBureauDetailPrefix: `${v}/protected/property/bureaux`,
    propertyBureau: 'property/bureau',
    propertyFestives: `${v}/public/property/festives`,
    protectedPropertyFestives: `${v}/protected/property/festives`,
    propertyFuneraires: `${v}/public/property/funeraires`,
    protectedPropertyFuneraires: `${v}/protected/property/funeraires`,
    propertyVacances: `${v}/public/property/vacances`,
    protectedPropertyVacances: `${v}/protected/property/vacances`,
    propertyTerrains: `${v}/public/property/terrains`,
    protectedPropertyTerrains: `${v}/protected/property/terrains`,
    /** Liste publique (accueil, annuaire) — même forme `{ data: [...] }` que le private */
    propertyHotelsPublic: `${v}/public/property/hotels`,
    propertyHotels: `${v}/private/property/hotels`,
    /** Liste complète hôtels — dashboard admin (`GET …/protected/property/hotels`, Bearer) */
    protectedPropertyHotels: `${v}/protected/property/hotels`,
    /** Indisponible / de nouveau en ligne — `PUT …/hotels/sold/{hotelId}`, body `{ status }` */
    soldHotel: `${v}/protected/property/hotels/sold/`,
    /** Chambre indisponible / de nouveau en ligne — `PUT …/chambres/sold/{chambreId}`, body `{ status }` */
    soldHotelRoom: `${v}/protected/property/chambres/sold/`,
    propertyHotelsByOwner: `${v}/private/property/hotels/owner/`,
    propertyHotelRoom: `${v}/private/property/hotels/chambre`,
    /** Liste publique des chambres (filtrer côté client par hôtel si besoin) */
    propertyHotelRoomsPublic: `${v}/public/property/hotels/chambre`,
    /** POST réservation sur une chambre — `…/chambre/{chambreId}` (corps : userId, chambreId, dates, message, type, reservationHeure) */
    publicPropertyHotelChambreReservation: `${v}/public/property/hotels/chambre`,

    storeTerrain: `${v}/private/property/terrains`,
    storeBureau: `${v}/private/property/bureaux`,
    storeFestive: `${v}/private/property/festives`,
    storeFuneraire: `${v}/private/property/funeraires`,
    storeVacance: `${v}/private/property/vacances`,
    storeAgence: `${v}/private/agences`,

    enableProperty: `${v}/protected/property/enable/`,
    soldProperty: `${v}/protected/property/sold/`,
    updatePropertyOwner: `${v}/protected/property/owner/`,

    updatePropertyImage: `${v}/protected/property/image/`,
    deletePropertyImage: `${v}/protected/property/image/`,

    soldTerrain: `${v}/protected/property/terrains/sold/`,
    updateTerrainOwner: `${v}/protected/property/terrains/owner/`,
    enableTerrain: `${v}/protected/property/terrains/enable/`,

    soldBureau: `${v}/protected/property/bureaux/sold/`,
    updateBureauOwner: `${v}/protected/property/bureaux/owner/`,
    updateBureauImage: `${v}/protected/property/bureaux/image/`,
    deleteBureauImage: `${v}/protected/property/bureaux/image/`,
    enableBureau: `${v}/protected/property/bureaux/enable/`,

    soldFestive: `${v}/protected/property/festives/sold/`,
    updateFestiveOwner: `${v}/protected/property/festives/owner/`,
    updateFestiveImage: `${v}/protected/property/festives/image/`,
    deleteFestiveImage: `${v}/protected/property/festives/image/`,
    enableFestive: `${v}/protected/property/festives/enable/`,

    soldFuneraire: `${v}/protected/property/funeraires/sold/`,
    updateFuneraireOwner: `${v}/protected/property/funeraires/owner/`,
    updateFuneraireImage: `${v}/protected/property/funeraires/image/`,
    deleteFuneraireImage: `${v}/protected/property/funeraires/image/`,
    enableFuneraire: `${v}/protected/property/funeraires/enable/`,

    propertyBureauxByOwner: `${v}/protected/property/bureaux/owner/`,
    propertyFestivesByOwner: `${v}/protected/property/festives/owner/`,
    propertyFunerairesByOwner: `${v}/protected/property/funeraires/owner/`,

    features: `${v}/private/property/features`,
    featureDetail: 'features/',
    featureProperties: 'features/',
    storeFeature: 'features',
    updateFeature: 'features/',
    deleteFeature: 'features/',

    propertyTypesList: `${v}/public/property/types`,
    propertyTypes: 'property',
    propertyTypeDetail: 'property/',
    propertiesByType: 'propertyType/',
    storePropertyType: 'propertyType',
    updatePropertyType: 'propertyType/',
    deletePropertyType: 'propertyType/',

    allFavories: `${v}/protected/favorite`,
    AddFavorite: `${v}/private/favorite`,
    getMyfavorites: `${v}/protected/favorite/user`,
    removeMyfavorites: `${v}/protected/favorite/delete`,
    removeAllFavories: `${v}/protected/favorite/delete/all`,
    favoriteProperty: `${v}/protected/favorite/property`,
    favoritesUserDelete: `${v}/protected/favorite/user/delete`,

    favoriteHotel: `${v}/protected/hotel/favorite`,
    favoriteHotelDelete: `${v}/protected/hotel/favorite/delete`,
    favoriteHotelDeleteAll: `${v}/protected/hotel/favorite/delete/all`,
    favoriteHotelByUser: `${v}/protected/hotel/favorite/user`,
    favoriteHotelUserDelete: `${v}/protected/hotel/favorite/user/delete`,

    favoriteFestive: `${v}/private/festive/favorite`,
    favoriteFestiveDelete: `${v}/protected/festive/favorite/delete`,
    favoriteFestiveDeleteAll: `${v}/protected/festive/favorite/delete/all`,
    favoriteFestiveByUser: `${v}/protected/festive/favorite/user`,
    favoriteFestiveUserDelete: `${v}/protected/festive/favorite/user/delete`,

    favoriteVacance: `${v}/private/vacance/favorite`,
    favoriteVacanceByUser: `${v}/protected/vacance/favorite/user`,
    favoriteVacanceDelete: `${v}/protected/vacance/favorite/delete`,

    favoriteFuneraire: `${v}/private/funeraire/favorite`,
    favoriteFuneraireDelete: `${v}/protected/funeraire/favorite/delete`,
    favoriteFuneraireDeleteAll: `${v}/protected/funeraire/favorite/delete/all`,
    favoriteFuneraireByUser: `${v}/protected/funeraire/favorite/user`,
    favoriteFuneraireUserDelete: `${v}/protected/funeraire/favorite/user/delete`,

    favoriteBureau: `${v}/private/bureau/favorite`,
    favoriteBureauDelete: `${v}/protected/bureau/favorite/delete`,
    favoriteBureauDeleteAll: `${v}/protected/bureau/favorite/delete/all`,
    favoriteBureauByUser: `${v}/protected/bureau/favorite/user`,
    favoriteBureauUserDelete: `${v}/protected/bureau/favorite/user/delete`,

    favoriteTerrain: `${v}/private/terrain/favorite`,
    favoriteTerrainByUser: `${v}/protected/terrain/favorite/user`,
    favoriteTerrainDelete: `${v}/protected/terrain/favorite/delete`,

    favoritePrestation: `${v}/protected/prestation/favorite`,
    AddfavoritePrestation: `${v}/private/prestation/favorite`,
    favoritePrestationByPrestation: `${v}/protected/prestation/favorite/prestation`,
    favoritePrestationDeleteAll: `${v}/protected/prestation/favorite/delete/all`,
    favoritePrestationByUser: `${v}/protected/prestation/favorite/user`,
    favoritePrestationDelete: `${v}/protected/prestation/favorite`,

    allReservations: `${v}/protected/reservations`,
    reservations: `${v}/private/reservations`,
    reservationsProtected: `${v}/protected/reservations`,
    reservationsByUser: 'user',
    addReservations: `${v}/private/reservations`,
    createReservation: `${v}/private/reservations`,
    addReservationVacance: `${v}/private/reservations/vacance`,
    addReservationTerrain: `${v}/private/reservations/terrain`,
    addReservationFuneraire: `${v}/private/reservations/funeraire`,
    addReservationFestive: `${v}/private/reservations/festive`,
    addReservationRoom: `${v}/private/reservations/chambre`,
    addReservationBureau: `${v}/private/reservations/bureau`,
    addReservationHotel: `${v}/private/reservations/chambre`,

    updateReservationStatus: `${v}/private/reservations/update/status/`,
    updateReservationVacanceStatus: `${v}/private/reservations/vacance/update/status/`,
    updateReservationTerrainStatus: `${v}/private/reservations/terrain/update/status/`,
    updateReservationFuneraireStatus: `${v}/private/reservations/funeraire/update/status/`,
    updateReservationFestiveStatus: `${v}/private/reservations/festive/update/status/`,
    updateReservationRoomStatus: `${v}/private/reservations/chambre/update/status/`,
    updateReservationBureauStatus: `${v}/private/reservations/bureau/update/status/`,

    validateReservationNotification: `${v}/protected/reservations/notification/state/`,
    partnersReservationNotification: `${v}/private/reservations/notification/partners/`,
    cancelReservationNotification: `${v}/private/reservations/notification/cancel/`,

    reservationsVacanceByUser: `${v}/protected/reservations/vacance/user/`,
    reservationsTerrainByUser: `${v}/protected/reservations/terrain/user/`,
    reservationsFuneraireByUser: `${v}/protected/reservations/funeraire/user/`,
    reservationsFestiveByUser: `${v}/protected/reservations/festive/user/`,
    reservationsBureauByUser: `${v}/protected/reservations/bureau/user/`,
    reservationsChambreByUser: `${v}/protected/reservations/chambre/user/`,

    reservationsHost: `${v}/protected/reservations/user/host/`,
    reservationsVacanceByHost: `${v}/protected/reservations/vacance/user/host/`,
    reservationsTerrainByHost: `${v}/protected/reservations/terrain/user/host/`,
    reservationsFuneraireByHost: `${v}/protected/reservations/funeraire/user/host/`,
    reservationsFestiveByHost: `${v}/protected/reservations/festive/user/host/`,
    reservationsBureauByHost: `${v}/protected/reservations/bureau/user/host/`,
    reservationsChambreByHost: `${v}/protected/reservations/chambre/user/host/`,
    /** Détail liste réservations liées à une chambre (paramètre côté API, ex. id chambre ou hôtel selon backend) */
    reservationsChambreByChambreEntity: `${v}/protected/reservations/chambre/chambre/`,

    propertyFilter: 'property/filter',
    propertySearch: 'property/search',

    services: 'services',
    serviceDetail: 'services/',
    storeService: 'services',
    updateService: 'services/',
    deleteService: 'services/',
    servicesByType: 'services/type/',
    myServices: 'services/my',

    prestations: `${v}/private/prestations`,
    publicPrestations: `${v}/public/prestations`,
    prestationsByServiceId: 'prestations/service/',
    prestationsByOwner: `${v}/protected/prestations/owner/`,
    deletePrestation: 'prestations/',
    updatePrestation: `${v}/private/prestations/update/`,

    cotation: `${v}/private/cotation`,
    deleteCotation: `${v}/protected/cotation/delete`,

    serviceRequests: 'service-requests',
    createServiceRequest: 'service-requests',
    getServiceRequests: 'service-requests/user',
    getServiceRequestsForProviders: 'service-requests/for-providers',
    serviceRequestDetail: 'service-requests/',
    respondToRequest: 'service-requests',
    acceptResponse: 'service-requests',
    cancelRequest: 'service-requests',

    sollicitation: `${v}/private/sollicitation`,
    sollicitationsByUser: `${v}/protected/sollicitation/user/`,
    sollicitationsByHost: `${v}/protected/sollicitation/user/host/`,
    updateSollicitation: `${v}/private/sollicitation/update/status/`,

    notifications: `${v}/private/notifications`,
    notificationsOwner: `${v}/protected/notifications/owner`,
    markNotificationRead: 'notifications/',
    markAllNotificationsRead: 'notifications/read-all',
    deleteNotification: 'notifications/',

    cards: `${v}/public/cards`,
    paymentSubscription: `${v}/protected/payment/subscription`,
    paymentCard: `${v}/protected/payment/card`,
    paymentHistory: `${v}/protected/payment/owner/`,
    /** Liste admin : paiements groupés par utilisateur — Bearer obligatoire */
    paymentUsers: `${v}/protected/payment/users`,

    agences: `${v}/public/agences`,
    agencesByOwner: `${v}/protected/agences/owner/`,
    protectedAgencesByOwner: `${v}/protected/agences/owner`,

    devises: `${v}/public/devises`,

    advertising: `${v}/protected/pub`,
    updateActiveAds: `${v}/protected/pub/update/active/`,

    webSocket: 'websocket',
} as const

/** Hôte API migration (Flutter Constantes.activeServer) */
export const MIGRATION_API_ORIGIN = 'https://migration.casanayo.com'
export const MIGRATION_API_BASE = `${MIGRATION_API_ORIGIN}/api`
export const MIGRATION_AUTH_ORIGIN = MIGRATION_API_ORIGIN
