import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { X, Calendar, MessageSquare, Info, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { l as useAuthStore } from './server.mjs';
import { u as useReservationStore } from './reservations-DAod7jv9.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ListingReservationModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    listingId: {},
    listingTitle: {},
    type: {}
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    useAuthStore();
    useReservationStore();
    const isLoading = ref(false);
    const form = reactive({
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: "",
      message: "",
      type: "STANDARD"
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[100] flex items-center justify-center p-4" }, _attrs))}><div class="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in transition-opacity"></div><div class="relative bg-white dark:bg-slate-950 w-full max-w-lg rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200"><div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"><div><h2 class="text-xl font-black text-slate-800">Finaliser la r\xE9servation</h2><p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">${ssrInterpolate(__props.listingTitle)}</p></div><button class="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">`);
        _push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
        _push(`</button></div><form class="p-8 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { class: "size-3" }, null, _parent2, _scopeId));
              _push2(` Date de d\xE9but `);
            } else {
              return [
                createVNode(unref(Calendar), { class: "size-3" }),
                createTextVNode(" Date de d\xE9but ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "date",
          modelValue: unref(form).startDate,
          "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
          required: "",
          class: "h-12 rounded-xl"
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { class: "size-3" }, null, _parent2, _scopeId));
              _push2(` Date de fin `);
            } else {
              return [
                createVNode(unref(Calendar), { class: "size-3" }),
                createTextVNode(" Date de fin ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "date",
          modelValue: unref(form).endDate,
          "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
          min: unref(form).startDate,
          class: "h-12 rounded-xl"
        }, null, _parent));
        _push(`</div></div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(MessageSquare), { class: "size-3" }, null, _parent2, _scopeId));
              _push2(` Message ou demande sp\xE9ciale `);
            } else {
              return [
                createVNode(unref(MessageSquare), { class: "size-3" }),
                createTextVNode(" Message ou demande sp\xE9ciale ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<textarea class="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium" placeholder="Ex: J&#39;aimerais confirmer la disponibilit\xE9 pour un groupe de 5 personnes...">${ssrInterpolate(unref(form).message)}</textarea></div><div class="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700">`);
        _push(ssrRenderComponent(unref(Info), { class: "size-5 shrink-0" }, null, _parent));
        _push(`<p class="text-[11px] font-bold leading-relaxed"> Cette demande n&#39;est pas un paiement imm\xE9diat. L&#39;h\xF4te v\xE9rifiera la disponibilit\xE9 avant de confirmer definitivement votre s\xE9jour. </p></div><div class="pt-4 flex gap-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          type: "button",
          variant: "ghost",
          onClick: ($event) => _ctx.$emit("close"),
          class: "flex-1 h-14 rounded-xl font-bold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Annuler`);
            } else {
              return [
                createTextVNode("Annuler")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          type: "submit",
          disabled: unref(isLoading),
          class: "flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isLoading)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-5 w-5 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(unref(isLoading) ? "Envoi..." : "Confirmer la demande")}`);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-5 w-5 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(unref(isLoading) ? "Envoi..." : "Confirmer la demande"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/ListingReservationModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ListingReservationModal-THezhj5t.mjs.map
