import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { Mail, ShieldAlert, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { useRouter } from 'vue-router';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(false);
    const error = ref("");
    const form = ref({
      email: "",
      password: "PAPa001",
      phone: "",
      firstName: "",
      lastName: ""
    });
    const selectedRole = ref(18);
    computed(() => {
      return form.value.email && form.value.firstName && form.value.lastName;
    });
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background" }, _attrs))}><div class="relative flex flex-col h-full bg-background z-10 border-r-4 border-primary/20"><div class="flex items-center justify-between p-6"><div class="flex items-center gap-2"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><span class="text-primary font-bold text-lg">C</span></div><span class="font-bold text-xl tracking-tight">CasaNayo <span class="text-xs ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold tracking-wider">Admin</span></span></div><div class="text-sm text-muted-foreground"><a href="/login" class="font-semibold text-primary hover:underline">Connexion</a></div></div><div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scrollbar-hide flex flex-col justify-center"><div class="w-full max-w-[450px] mx-auto pb-20 space-y-8"><div class="space-y-2"><h1 class="text-3xl font-black tracking-tight">Acc\xE8s Manager</h1><p class="text-muted-foreground">Cr\xE9ation de compte \xE0 privil\xE8ges \xE9lev\xE9s.</p></div><form class="space-y-6"><div class="grid grid-cols-2 gap-4"><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pr\xE9nom`);
          } else {
            return [
              createTextVNode("Pr\xE9nom")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.firstName,
        "onUpdate:modelValue": ($event) => form.value.firstName = $event,
        class: "h-11",
        placeholder: "Pr\xE9nom"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Nom`);
          } else {
            return [
              createTextVNode("Nom")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.lastName,
        "onUpdate:modelValue": ($event) => form.value.lastName = $event,
        class: "h-11",
        placeholder: "Nom"
      }, null, _parent));
      _push(`</div></div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Email Professionnel`);
          } else {
            return [
              createTextVNode("Email Professionnel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative">`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.email,
        "onUpdate:modelValue": ($event) => form.value.email = $event,
        type: "email",
        class: "pl-9 h-11",
        placeholder: "admin@casanayo.com"
      }, null, _parent));
      _push(`</div></div><div class="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-xs uppercase font-bold tracking-wider text-muted-foreground" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Niveau d&#39;accr\xE9ditation`);
          } else {
            return [
              createTextVNode("Niveau d'accr\xE9ditation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-2 gap-3"><div class="${ssrRenderClass([selectedRole.value === 18 ? "border-primary bg-primary text-white shadow-lg shadow-primary/25" : "bg-card border-border hover:border-primary/50 text-muted-foreground", "cursor-pointer text-center p-3 rounded-xl border transition-all text-sm font-bold flex flex-col items-center justify-center gap-1"])}">`);
      _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-5 w-5 mb-1" }, null, _parent));
      _push(` Admin </div><div class="${ssrRenderClass([selectedRole.value === 19 ? "border-primary bg-primary text-white shadow-lg shadow-primary/25" : "bg-card border-border hover:border-primary/50 text-muted-foreground", "cursor-pointer text-center p-3 rounded-xl border transition-all text-sm font-bold flex flex-col items-center justify-center gap-1"])}">`);
      _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-5 w-5 mb-1" }, null, _parent));
      _push(` Super Admin </div></div></div>`);
      if (error.value) {
        _push(`<div class="text-destructive text-sm font-medium text-center bg-destructive/10 p-3 rounded-lg">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        type: "submit",
        class: "w-full h-12 text-base font-bold shadow-xl shadow-primary/20 rounded-xl",
        disabled: isLoading.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (isLoading.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(isLoading.value ? "Initialisation..." : "Cr\xE9er l'acc\xE8s")}`);
          } else {
            return [
              isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(isLoading.value ? "Initialisation..." : "Cr\xE9er l'acc\xE8s"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form></div></div></div><div class="hidden lg:block relative bg-muted overflow-hidden"><div class="absolute inset-0 bg-primary/90 mix-blend-multiply z-10"></div><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&amp;fit=crop&amp;q=80" class="absolute inset-0 h-full w-full object-cover grayscale opacity-60"><div class="relative z-20 flex h-full flex-col justify-center items-center text-center p-16 text-white/90"><div class="max-w-md space-y-6"><div class="h-20 w-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-md mb-8 border border-white/20">`);
      _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-10 w-10 text-white" }, null, _parent));
      _push(`</div><h2 class="text-4xl font-extrabold leading-tight tracking-tight">Administration</h2><p class="text-lg opacity-80 leading-relaxed font-light">Portail s\xE9curis\xE9 pour la gestion de la plateforme CasaNayo.</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-BcUebZ90.mjs.map
