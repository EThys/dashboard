<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{ 'update:page': [page: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.page * props.pageSize, props.total))

const pages = computed<(number | 'ellipsis')[]>(() => {
  const last = totalPages.value
  const current = Math.min(Math.max(props.page, 1), last)
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1)

  const marks = [1, last, current - 1, current, current + 1].filter((n) => n >= 1 && n <= last)
  const unique = [...new Set(marks)].sort((a, b) => a - b)
  const out: (number | 'ellipsis')[] = []
  unique.forEach((n, index) => {
    if (index > 0 && n - unique[index - 1] > 1) out.push('ellipsis')
    out.push(n)
  })
  return out
})

function go(next: number) {
  if (next < 1 || next > totalPages.value || next === props.page) return
  emit('update:page', next)
}
</script>

<template>
  <nav
    v-if="total > 0"
    class="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
    aria-label="Pagination"
  >
    <p class="text-sm text-slate-500">
      <span class="font-medium text-slate-900">{{ from }}–{{ to }}</span>
      sur {{ total }}
    </p>
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        <ChevronLeft class="size-4" />
        Précédent
      </button>
      <template v-for="(item, index) in pages" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="px-1 text-sm text-slate-400">…</span>
        <button
          v-else
          type="button"
          class="grid size-9 place-items-center rounded-lg text-sm font-medium transition-colors"
          :class="item === page ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </template>
      <button
        type="button"
        class="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
      >
        Suivant
        <ChevronRight class="size-4" />
      </button>
    </div>
  </nav>
</template>
