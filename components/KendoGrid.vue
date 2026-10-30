<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
import '@progress/kendo-theme-default/dist/all.css'

const props = defineProps<{
  dataItems: unknown[]
  columns: unknown[]
  total?: number
  skip?: number
  take?: number
  sort?: unknown
  filter?: unknown
  pageable?: unknown
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  reorderable?: boolean
}>()

const emit = defineEmits<{
  datastatechange: [event: { data: Record<string, unknown> }]
  rowclick: [event: { dataItem: Record<string, unknown>; event?: Event }]
}>()

const host = ref<HTMLElement | null>(null)
const mountError = ref('')
let vm: null | {
  $destroy: () => void
  dataItems: unknown[]
  columns: unknown[]
  total: number
  skip: number
  take: number
  sort: unknown
  filter: unknown
  pageable: unknown
} = null

function plain(value: unknown): unknown {
  if (typeof value === 'function') return value
  if (Array.isArray(value)) return value.map((item) => plain(item))
  if (value && typeof value === 'object') {
    const raw = toRaw(value) as Record<string, unknown>
    const next: Record<string, unknown> = {}
    for (const key of Object.keys(raw)) next[key] = plain(raw[key])
    return next
  }
  return value
}

function snapshot() {
  return {
    dataItems: plain(props.dataItems || []) as unknown[],
    columns: plain(props.columns || []) as unknown[],
    total: props.total ?? 0,
    skip: props.skip ?? 0,
    take: props.take ?? 10,
    sort: plain(props.sort || []),
    filter: props.filter == null ? undefined : plain(props.filter),
    pageable: plain(props.pageable),
  }
}

function sync() {
  if (!vm) return
  Object.assign(vm, snapshot())
}

onMounted(async () => {
  const anchor = host.value
  if (!anchor) return
  try {
    const vue2Module = await import('virtual:kendo-vue2')
    const Vue2 = (vue2Module as { default?: new (options: object) => typeof vm }).default || vue2Module
    const { Grid } = await import('@progress/kendo-vue-grid')
    const el = document.createElement('div')
    anchor.appendChild(el)
    const initial = snapshot()
    vm = new (Vue2 as new (options: object) => NonNullable<typeof vm>)({
      el,
      data() {
        return initial
      },
      render(this: ReturnType<typeof snapshot>, h: (tag: unknown, data?: object) => unknown) {
        return h(Grid, {
          style: { height: '100%' },
          props: {
            dataItems: this.dataItems,
            columns: this.columns,
            total: this.total,
            skip: this.skip,
            take: this.take,
            sort: this.sort,
            filter: this.filter,
            pageable: this.pageable,
            sortable: props.sortable,
            filterable: props.filterable,
            resizable: props.resizable,
            reorderable: props.reorderable,
          },
          on: {
            datastatechange: (event: { data: Record<string, unknown> }) => emit('datastatechange', event),
            rowclick: (event: { dataItem: Record<string, unknown>; event?: Event }) => emit('rowclick', event),
          },
        })
      },
    })
  } catch (error) {
    console.error(error)
    mountError.value = error instanceof Error ? error.message : 'La grille Kendo n’a pas pu s’afficher.'
  }
})

watch(
  () => [props.dataItems, props.columns, props.total, props.skip, props.take, props.sort, props.filter, props.pageable],
  () => sync(),
)

onBeforeUnmount(() => {
  vm?.$destroy()
  vm = null
})
</script>

<template>
  <div>
    <div ref="host" class="kendo-host" />
    <p v-if="mountError" class="mt-2 text-sm text-destructive">{{ mountError }}</p>
  </div>
</template>

<style>
.kendo-host {
  height: 640px;
}
.kendo-host .k-grid {
  height: 100%;
}
</style>
