import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ClockTimePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const mode = ref("hour");
    ref(false);
    ref(null);
    const parsed = computed(() => {
      const [h = "14", m = "00"] = String(props.modelValue || "14:00:00").split(":");
      const hour = Math.min(23, Math.max(0, Number(h) || 0));
      const minute = Math.min(59, Math.max(0, Number(m) || 0));
      return { hour, minute };
    });
    const display = computed(() => {
      const hh = String(parsed.value.hour).padStart(2, "0");
      const mm = String(parsed.value.minute).padStart(2, "0");
      return { hh, mm };
    });
    function markStyle(index, radius) {
      const angle = -Math.PI / 2 + index / 12 * Math.PI * 2;
      return {
        left: `calc(50% + ${Math.cos(angle) * radius}px)`,
        top: `calc(50% + ${Math.sin(angle) * radius}px)`
      };
    }
    const handDeg = computed(() => {
      if (mode.value === "minute") return parsed.value.minute * 6 - 90;
      return (parsed.value.hour % 12 + parsed.value.minute / 60) * 30 - 90;
    });
    const innerHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const outerHours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const minuteMarks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-center gap-2"><button type="button" class="${ssrRenderClass([unref(mode) === "hour" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80", "min-w-[4.5rem] rounded-2xl px-3 py-2 text-3xl font-black tabular-nums transition"])}">${ssrInterpolate(unref(display).hh)}</button><span class="text-3xl font-black text-muted-foreground">:</span><button type="button" class="${ssrRenderClass([unref(mode) === "minute" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80", "min-w-[4.5rem] rounded-2xl px-3 py-2 text-3xl font-black tabular-nums transition"])}">${ssrInterpolate(unref(display).mm)}</button></div><div class="relative mx-auto h-[280px] w-[280px] touch-none select-none rounded-full border border-border bg-muted/40 shadow-inner"><div class="pointer-events-none absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div><div class="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1 origin-left rounded-full bg-primary" style="${ssrRenderStyle({ width: unref(mode) === "minute" ? "108px" : "72px", transform: `rotate(${unref(handDeg)}deg)` })}"></div>`);
      if (unref(mode) === "hour") {
        _push(`<!--[--><!--[-->`);
        ssrRenderList(innerHours, (hour, index) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(parsed).hour === hour ? "bg-primary text-white" : "text-foreground hover:bg-background", "absolute z-20 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold transition"])}" style="${ssrRenderStyle(markStyle(index, 72))}">${ssrInterpolate(String(hour).padStart(2, "0"))}</button>`);
        });
        _push(`<!--]--><!--[-->`);
        ssrRenderList(outerHours, (hour, index) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(parsed).hour === hour ? "bg-primary text-white" : "text-foreground hover:bg-background", "absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold transition"])}" style="${ssrRenderStyle(markStyle(index, 112))}">${ssrInterpolate(hour)}</button>`);
        });
        _push(`<!--]--><!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(minuteMarks, (minute, index) => {
          _push(`<button type="button" class="${ssrRenderClass([unref(parsed).minute === minute ? "bg-primary text-white" : "text-foreground hover:bg-background", "absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold transition"])}" style="${ssrRenderStyle(markStyle(index, 108))}">${ssrInterpolate(String(minute).padStart(2, "0"))}</button>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div><p class="text-center text-xs text-muted-foreground"> Cercle int\xE9rieur 00\u201311, ext\xE9rieur 12\u201323. Glissez l\u2019aiguille pour les minutes, y compris 22:15 ou 22:37. </p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/ClockTimePicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ClockTimePicker-CLJj4QYt.mjs.map
