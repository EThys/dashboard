<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const mode = ref<'hour' | 'minute'>('hour')
const dragging = ref(false)
const clockRef = ref<HTMLElement | null>(null)

const parsed = computed(() => {
  const [h = '14', m = '00'] = String(props.modelValue || '14:00:00').split(':')
  const hour = Math.min(23, Math.max(0, Number(h) || 0))
  const minute = Math.min(59, Math.max(0, Number(m) || 0))
  return { hour, minute }
})

const display = computed(() => {
  const hh = String(parsed.value.hour).padStart(2, '0')
  const mm = String(parsed.value.minute).padStart(2, '0')
  return { hh, mm }
})

function commit(hour: number, minute: number) {
  const hh = String(Math.min(23, Math.max(0, hour))).padStart(2, '0')
  const mm = String(Math.min(59, Math.max(0, minute))).padStart(2, '0')
  emit('update:modelValue', `${hh}:${mm}:00`)
}

function markStyle(index: number, radius: number) {
  const angle = -Math.PI / 2 + (index / 12) * Math.PI * 2
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
  }
}

const handDeg = computed(() => {
  if (mode.value === 'minute') return parsed.value.minute * 6 - 90
  return ((parsed.value.hour % 12) + parsed.value.minute / 60) * 30 - 90
})

function readPoint(event: PointerEvent) {
  const el = clockRef.value
  if (!el) return null
  const rect = el.getBoundingClientRect()
  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI
  const normalized = (deg + 360) % 360
  return { deg: normalized, dist: Math.hypot(dx, dy), radius: rect.width / 2 }
}

function applyPoint(event: PointerEvent) {
  const point = readPoint(event)
  if (!point) return
  if (mode.value === 'minute') {
    commit(parsed.value.hour, Math.round(point.deg / 6) % 60)
    return
  }
  const hour12 = Math.round(point.deg / 30) % 12
  const inner = point.dist < point.radius * 0.62
  const hour = inner ? hour12 : hour12 === 0 ? 12 : hour12 + 12
  commit(hour, parsed.value.minute)
}

function onPointerDown(event: PointerEvent) {
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  applyPoint(event)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  applyPoint(event)
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  applyPoint(event)
  if (mode.value === 'hour') mode.value = 'minute'
}

function pickHour(hour: number) {
  commit(hour, parsed.value.minute)
  mode.value = 'minute'
}

function pickMinute(minute: number) {
  commit(parsed.value.hour, minute)
}

const innerHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const outerHours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const minuteMarks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-center gap-2">
      <button
        type="button"
        class="min-w-[4.5rem] rounded-2xl px-3 py-2 text-3xl font-black tabular-nums transition"
        :class="mode === 'hour' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'"
        @click="mode = 'hour'"
      >
        {{ display.hh }}
      </button>
      <span class="text-3xl font-black text-muted-foreground">:</span>
      <button
        type="button"
        class="min-w-[4.5rem] rounded-2xl px-3 py-2 text-3xl font-black tabular-nums transition"
        :class="mode === 'minute' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'"
        @click="mode = 'minute'"
      >
        {{ display.mm }}
      </button>
    </div>

    <div
      ref="clockRef"
      class="relative mx-auto h-[280px] w-[280px] touch-none select-none rounded-full border border-border bg-muted/40 shadow-inner"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div class="pointer-events-none absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1 origin-left rounded-full bg-primary"
        :style="{ width: mode === 'minute' ? '108px' : '72px', transform: `rotate(${handDeg}deg)` }"
      />

      <template v-if="mode === 'hour'">
        <button
          v-for="(hour, index) in innerHours"
          :key="`in-${hour}`"
          type="button"
          class="absolute z-20 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold transition"
          :class="parsed.hour === hour ? 'bg-primary text-white' : 'text-foreground hover:bg-background'"
          :style="markStyle(index, 72)"
          @pointerdown.stop
          @click.stop="pickHour(hour)"
        >
          {{ String(hour).padStart(2, '0') }}
        </button>
        <button
          v-for="(hour, index) in outerHours"
          :key="`out-${hour}`"
          type="button"
          class="absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold transition"
          :class="parsed.hour === hour ? 'bg-primary text-white' : 'text-foreground hover:bg-background'"
          :style="markStyle(index, 112)"
          @pointerdown.stop
          @click.stop="pickHour(hour)"
        >
          {{ hour }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="(minute, index) in minuteMarks"
          :key="minute"
          type="button"
          class="absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold transition"
          :class="parsed.minute === minute ? 'bg-primary text-white' : 'text-foreground hover:bg-background'"
          :style="markStyle(index, 108)"
          @pointerdown.stop
          @click.stop="pickMinute(minute)"
        >
          {{ String(minute).padStart(2, '0') }}
        </button>
      </template>
    </div>

    <p class="text-center text-xs text-muted-foreground">
      Cercle intérieur 00–11, extérieur 12–23. Glissez l’aiguille pour les minutes, y compris 22:15 ou 22:37.
    </p>
  </div>
</template>
