import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ListPagination",
  __ssrInlineRender: true,
  props: {
    page: {},
    total: {},
    pageSize: {}
  },
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
    const from = computed(() => props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1);
    const to = computed(() => Math.min(props.page * props.pageSize, props.total));
    const pages = computed(() => {
      const last = totalPages.value;
      const current = Math.min(Math.max(props.page, 1), last);
      if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
      const marks = [1, last, current - 1, current, current + 1].filter((n) => n >= 1 && n <= last);
      const unique = [...new Set(marks)].sort((a, b) => a - b);
      const out = [];
      unique.forEach((n, index) => {
        if (index > 0 && n - unique[index - 1] > 1) out.push("ellipsis");
        out.push(n);
      });
      return out;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.total > 0) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          class: "flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between",
          "aria-label": "Pagination"
        }, _attrs))}><p class="text-sm text-slate-500"><span class="font-medium text-slate-900">${ssrInterpolate(from.value)}\u2013${ssrInterpolate(to.value)}</span> sur ${ssrInterpolate(__props.total)}</p><div class="flex items-center gap-1"><button type="button" class="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"${ssrIncludeBooleanAttr(__props.page <= 1) ? " disabled" : ""}>`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-4" }, null, _parent));
        _push(` Pr\xE9c\xE9dent </button><!--[-->`);
        ssrRenderList(pages.value, (item, index) => {
          _push(`<!--[-->`);
          if (item === "ellipsis") {
            _push(`<span class="px-1 text-sm text-slate-400">\u2026</span>`);
          } else {
            _push(`<button type="button" class="${ssrRenderClass([item === __props.page ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100", "grid size-9 place-items-center rounded-lg text-sm font-medium transition-colors"])}"${ssrRenderAttr("aria-current", item === __props.page ? "page" : void 0)}>${ssrInterpolate(item)}</button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--><button type="button" class="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"${ssrIncludeBooleanAttr(__props.page >= totalPages.value) ? " disabled" : ""}> Suivant `);
        _push(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent));
        _push(`</button></div></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/ListPagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ListPagination-BYvyA4ig.mjs.map
