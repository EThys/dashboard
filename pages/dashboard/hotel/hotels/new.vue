<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Loader2, ImageIcon } from 'lucide-vue-next'
import { Button, Input, Label } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'
import { filesToDataUrls, toApiBase64ImagePayload } from '@/utils/fileToDataUrl'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()

const submitting = ref(false)
/** Types depuis `GET /public/property/types` (ex. Hotels → propertyTypeId 5). */
const propertyTypeReady = ref(false)
const hotelTypeLabel = ref('')

const DEFAULT_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'

const galleryFiles = ref<File[]>([])
const galleryPreviewUrls = ref<string[]>([])
const galleryInputRef = ref<HTMLInputElement | null>(null)

function revokeGalleryPreviews() {
  galleryPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u))
  galleryPreviewUrls.value = []
}

function onGalleryChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files?.length ? Array.from(input.files) : []
  revokeGalleryPreviews()
  galleryFiles.value = files
  galleryPreviewUrls.value = files.map((f) => URL.createObjectURL(f))
}

function clearGallery() {
  revokeGalleryPreviews()
  galleryFiles.value = []
  if (galleryInputRef.value) galleryInputRef.value.value = ''
}

const form = ref({
  title: '',
  description: '',
  address: '',
  propertyTypeId: 0,
  communeValue: '',
  quartierValue: '',
  cityValue: '',
  countryValue: 'RDC',
  cityId: 0,
  postalCode: '',
  communeId: 0,
  quartierId: 0,
  latitude: 0,
  longitude: 0,
  isAvailable: true,
  available: true,
})

onBeforeUnmount(() => {
  revokeGalleryPreviews()
})

/** Ex. API https://migration.casanayo.com/api/v1/public/property/types — entrée « Hotels », propertyTypeId 5 */
function pickHotelFromPropertyTypes(list: { propertyTypeId?: number; id?: number; name?: string }[]) {
  const found = list.find((t) => /h[oô]tel/i.test(String(t.name || '').trim()))
  if (!found) return null
  const id = Number(found.propertyTypeId ?? found.id ?? 0)
  if (!Number.isFinite(id) || id <= 0) return null
  return { id, name: String(found.name || 'Hotels').trim() }
}

onMounted(async () => {
  propertyTypeReady.value = false
  hotelTypeLabel.value = ''
  try {
    const apiBase = config.public.apiBase as string
    const res: any = await $fetch(joinApi(apiBase, ApiEndpoints.propertyTypesList))
    const raw = res?.data ?? []
    const list = Array.isArray(raw) ? raw : []
    const picked = pickHotelFromPropertyTypes(list)
    if (picked) {
      form.value.propertyTypeId = picked.id
      hotelTypeLabel.value = picked.name
    }
  } catch {
    /* ignore */
  } finally {
    propertyTypeReady.value = true
  }
})

const canSubmit = computed(
  () =>
    propertyTypeReady.value &&
    form.value.title.trim().length > 2 &&
    form.value.address.trim().length > 2 &&
    auth.user?.userId &&
    form.value.propertyTypeId > 0
)

async function submit() {
  if (!canSubmit.value || !auth.token) {
    toast.error(
      form.value.propertyTypeId <= 0
        ? 'Type de bien hôtel indisponible (API types). Réessayez plus tard ou contactez le support.'
        : 'Complétez les champs obligatoires (titre, adresse).'
    )
    return
  }
  submitting.value = true
  try {
    const apiBase = config.public.apiBase as string
    const imageUrls =
      galleryFiles.value.length > 0 ? await filesToDataUrls(galleryFiles.value) : []
    const rawB64 = imageUrls.map(toApiBase64ImagePayload)
    const primaryImage = rawB64[0] ?? toApiBase64ImagePayload(DEFAULT_HOTEL_IMAGE)
    const imagesPayload =
      rawB64.length > 0
        ? rawB64.map((image) => ({ image }))
        : [{ image: toApiBase64ImagePayload(DEFAULT_HOTEL_IMAGE) }]
    const body = {
      userId: auth.user!.userId,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      address: form.value.address.trim(),
      image: primaryImage,
      images: imagesPayload,
      propertyTypeId: form.value.propertyTypeId,
      communeValue: form.value.communeValue,
      quartierValue: form.value.quartierValue,
      cityValue: form.value.cityValue,
      countryValue: form.value.countryValue,
      cityId: form.value.cityId || 0,
      postalCode: form.value.postalCode,
      communeId: form.value.communeId || 0,
      quartierId: form.value.quartierId || 0,
      latitude: Number(form.value.latitude) || 0,
      longitude: Number(form.value.longitude) || 0,
      isAvailable: form.value.isAvailable,
      available: form.value.available,
    }
    const res: any = await $fetch(joinApi(apiBase, ApiEndpoints.propertyHotels), {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body,
    })
    const newId = res?.hotel?.id ?? res?.id ?? res?.data?.id
    toast.success('Hôtel créé')
    if (newId) router.push(`/dashboard/hotel/hotels/${newId}`)
    else router.push('/dashboard/hotel/hotels')
  } catch (e: any) {
    console.error(e)
    toast.error(e?.data?.message || 'Création impossible')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-10">
    <div>
      <h1 class="text-2xl font-black md:text-3xl">Nouvel hôtel</h1>
      <p class="mt-1 text-sm text-muted-foreground">Les voyageurs voient le titre, les photos et l’emplacement en premier.</p>
    </div>

    <form class="space-y-8 rounded-[2rem] border border-border bg-card p-6 md:p-10 shadow-sm" @submit.prevent="submit">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="md:col-span-2 space-y-2">
          <Label for="title">Nom de l’établissement *</Label>
          <Input id="title" v-model="form.title" placeholder="ex. Hôtel du fleuve" class="h-12 rounded-xl" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <Label>Type de bien</Label>
          <p class="text-xs text-muted-foreground">
            Défini automatiquement depuis l’API des types (ex. Hotels →
            <span class="font-mono">propertyTypeId</span>).
          </p>
          <div
            class="flex min-h-12 items-center rounded-xl border border-input bg-muted/50 px-4 text-sm text-foreground"
            role="status"
            aria-live="polite"
          >
            <template v-if="propertyTypeReady && form.propertyTypeId > 0">
              <span class="font-medium">{{ hotelTypeLabel || 'Hotels' }}</span>
              <span class="ml-2 text-muted-foreground" aria-hidden="true">·</span>
              <span class="ml-2 font-mono text-xs text-muted-foreground">propertyTypeId {{ form.propertyTypeId }}</span>
            </template>
            <span v-else class="text-muted-foreground">Chargement du type…</span>
          </div>
        </div>
        <div class="md:col-span-2 space-y-2">
          <Label for="desc">Description</Label>
          <textarea
            id="desc"
            v-model="form.description"
            rows="4"
            class="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Ambiance, services, public cible…"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <Label for="gallery-files">Photos de l’établissement</Label>
          <p class="text-xs text-muted-foreground">
            Plusieurs images possibles. Envoi : <span class="font-mono">image</span> (1ʳᵉ) et
            <span class="font-mono">images[]</span> — chaînes Base64 pures (sans préfixe
            <span class="font-mono">data:image/…</span>).
          </p>
          <div class="flex flex-wrap items-start gap-4">
            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-4 py-3 text-sm font-medium transition hover:bg-muted/50"
            >
              <ImageIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Choisir des images</span>
              <input
                id="gallery-files"
                ref="galleryInputRef"
                type="file"
                accept="image/*"
                multiple
                class="sr-only"
                @change="onGalleryChange"
              />
            </label>
            <Button
              v-if="galleryFiles.length"
              type="button"
              variant="ghost"
              size="sm"
              class="rounded-full"
              @click="clearGallery"
            >
              Tout retirer
            </Button>
          </div>
          <div v-if="galleryPreviewUrls.length" class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div
              v-for="(src, i) in galleryPreviewUrls"
              :key="i"
              class="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img :src="src" :alt="`Aperçu ${i + 1}`" class="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div class="md:col-span-2 space-y-2">
          <Label for="address">Adresse complète *</Label>
          <Input id="address" v-model="form.address" class="h-12 rounded-xl" />
        </div>
        <div class="space-y-2">
          <Label for="city">Ville</Label>
          <Input id="city" v-model="form.cityValue" class="h-12 rounded-xl" />
        </div>
        <div class="space-y-2">
          <Label for="commune">Commune</Label>
          <Input id="commune" v-model="form.communeValue" class="h-12 rounded-xl" />
        </div>
        <div class="space-y-2">
          <Label for="quartier">Quartier</Label>
          <Input id="quartier" v-model="form.quartierValue" class="h-12 rounded-xl" />
        </div>
        <div class="space-y-2">
          <Label for="country">Pays</Label>
          <Input id="country" v-model="form.countryValue" class="h-12 rounded-xl" />
        </div>
        <div class="flex flex-wrap items-center gap-6 pt-2">
          <label class="flex items-center gap-2 text-sm font-medium">
            <input v-model="form.isAvailable" type="checkbox" class="rounded border-input" />
            Visible / disponible
          </label>
          <label class="flex items-center gap-2 text-sm font-medium">
            <input v-model="form.available" type="checkbox" class="rounded border-input" />
            Annonce active
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-border pt-6">
        <Button type="button" variant="outline" class="rounded-full" @click="router.push('/dashboard/hotel/hotels')">Annuler</Button>
        <Button type="submit" class="rounded-full min-w-[160px]" :disabled="!canSubmit || submitting">
          <Loader2 v-if="submitting" class="mr-2 h-4 w-4 animate-spin" />
          Enregistrer
        </Button>
      </div>
    </form>
  </div>
</template>
