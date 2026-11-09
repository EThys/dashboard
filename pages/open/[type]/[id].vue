<script setup lang="ts">
import { decodeId } from '@/utils/urlObfuscator'
import { publicPropertyPath, publicServicePath, publicVacancePath } from '@/utils/openListingLink'

definePageMeta({ layout: 'empty' })

const route = useRoute()
const playStore = 'https://play.google.com/store/apps/details?id=com.casa.casa.casa'
const appStore = 'https://apps.apple.com/fr/app/casanayo/id6757759953'

const listingId = computed(() => {
  const raw = String(route.params.id || '')
  if (/^\d+$/.test(raw)) return Number(raw)
  const decoded = decodeId(raw)
  return decoded > 0 ? decoded : 0
})

const listingType = computed(() => String(route.params.type || ''))
const kind = computed(() => {
  const value = route.query.kind
  return typeof value === 'string' ? value : 'property'
})

const websitePath = computed(() => {
  if (listingType.value === 'service') return publicServicePath(listingId.value)
  if (kind.value === 'vacance') return publicVacancePath(listingId.value)
  return publicPropertyPath(listingId.value, kind.value)
})

const appPath = computed(() => {
  const type = listingType.value === 'service' ? 'service' : 'property'
  const query = type === 'property' ? `?kind=${encodeURIComponent(kind.value)}` : ''
  const token = encodeURIComponent(String(route.params.id || ''))
  return `open/${type}/${token}${query}`
})

const androidIntent = computed(() => {
  const fallback = encodeURIComponent(playStore)
  return `intent://${appPath.value}#Intent;scheme=casanayo;package=com.casa.casa.casa;S.browser_fallback_url=${fallback};end`
})

function openOnThisPhone() {
  const id = listingId.value
  if (!id) {
    window.location.href = playStore
    return
  }
  const agent = navigator.userAgent || ''
  if (/Android/i.test(agent)) {
    window.location.href = androidIntent.value
    return
  }
  if (/iPhone|iPad|iPod/i.test(agent)) {
    let left = false
    const markLeft = () => { left = true }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) markLeft()
    })
    window.addEventListener('pagehide', markLeft)
    window.location.href = `casanayo://${appPath.value}`
    window.setTimeout(() => {
      if (!left) window.location.href = appStore
    }, 1500)
    return
  }
  window.location.href = websitePath.value
}

onMounted(openOnThisPhone)
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
    <p class="text-lg font-black">Ouverture de CasaNayo…</p>
    <p class="max-w-sm text-sm text-muted-foreground">
      Si l’application est installée, la fiche s’ouvre. Sinon, la boutique s’affiche.
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <a :href="androidIntent" class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">Ouvrir l’annonce</a>
      <a :href="websitePath" class="rounded-full border border-border px-4 py-2 text-sm font-bold">Voir sur le site</a>
    </div>
  </div>
</template>
