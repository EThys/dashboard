import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { ImageIcon, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { a as useRouter, l as useAuthStore } from './server.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const auth = useAuthStore();
    const submitting = ref(false);
    const propertyTypeReady = ref(false);
    const hotelTypeLabel = ref("");
    const galleryFiles = ref([]);
    const galleryPreviewUrls = ref([]);
    const galleryInputRef = ref(null);
    function revokeGalleryPreviews() {
      galleryPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u));
      galleryPreviewUrls.value = [];
    }
    function clearGallery() {
      revokeGalleryPreviews();
      galleryFiles.value = [];
      if (galleryInputRef.value) galleryInputRef.value.value = "";
    }
    const form = ref({
      title: "",
      description: "",
      address: "",
      propertyTypeId: 0,
      communeValue: "",
      quartierValue: "",
      cityValue: "",
      countryValue: "RDC",
      cityId: 0,
      postalCode: "",
      communeId: 0,
      quartierId: 0,
      latitude: 0,
      longitude: 0,
      isAvailable: true,
      available: true
    });
    const canSubmit = computed(
      () => {
        var _a;
        return propertyTypeReady.value && form.value.title.trim().length > 2 && form.value.address.trim().length > 2 && ((_a = auth.user) == null ? void 0 : _a.userId) && form.value.propertyTypeId > 0;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-3xl space-y-10" }, _attrs))}><div><h1 class="text-2xl font-black md:text-3xl">Nouvel h\xF4tel</h1><p class="mt-1 text-sm text-muted-foreground">Les voyageurs voient le titre, les photos et l\u2019emplacement en premier.</p></div><form class="space-y-8 rounded-[2rem] border border-border bg-card p-6 md:p-10 shadow-sm"><div class="grid gap-6 md:grid-cols-2"><div class="md:col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "title" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Nom de l\u2019\xE9tablissement *`);
          } else {
            return [
              createTextVNode("Nom de l\u2019\xE9tablissement *")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "title",
        modelValue: form.value.title,
        "onUpdate:modelValue": ($event) => form.value.title = $event,
        placeholder: "ex. H\xF4tel du fleuve",
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="space-y-2 md:col-span-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Type de bien`);
          } else {
            return [
              createTextVNode("Type de bien")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex min-h-12 items-center rounded-xl border border-input bg-muted/50 px-4 text-sm text-foreground" role="status" aria-live="polite">`);
      if (propertyTypeReady.value && form.value.propertyTypeId > 0) {
        _push(`<span class="font-medium">${ssrInterpolate(hotelTypeLabel.value || "Hotels")}</span>`);
      } else {
        _push(`<span class="text-muted-foreground">Chargement du type\u2026</span>`);
      }
      _push(`</div></div><div class="md:col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "desc" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Description`);
          } else {
            return [
              createTextVNode("Description")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<textarea id="desc" rows="4" class="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Ambiance, services, public cible\u2026">${ssrInterpolate(form.value.description)}</textarea></div><div class="space-y-2 md:col-span-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "gallery-files" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Photos de l\u2019\xE9tablissement`);
          } else {
            return [
              createTextVNode("Photos de l\u2019\xE9tablissement")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-xs text-muted-foreground">Plusieurs images possibles.</p><div class="flex flex-wrap items-start gap-4"><label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-4 py-3 text-sm font-medium transition hover:bg-muted/50">`);
      _push(ssrRenderComponent(unref(ImageIcon), { class: "h-4 w-4 shrink-0 text-muted-foreground" }, null, _parent));
      _push(`<span>Choisir des images</span><input id="gallery-files" type="file" accept="image/*" multiple class="sr-only"></label>`);
      if (galleryFiles.value.length) {
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          type: "button",
          variant: "ghost",
          size: "sm",
          class: "rounded-full",
          onClick: clearGallery
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Tout retirer `);
            } else {
              return [
                createTextVNode(" Tout retirer ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (galleryPreviewUrls.value.length) {
        _push(`<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(galleryPreviewUrls.value, (src, i) => {
          _push(`<div class="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"><img${ssrRenderAttr("src", src)}${ssrRenderAttr("alt", `Aper\xE7u ${i + 1}`)} class="h-full w-full object-cover"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="md:col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "address" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Adresse compl\xE8te *`);
          } else {
            return [
              createTextVNode("Adresse compl\xE8te *")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "address",
        modelValue: form.value.address,
        "onUpdate:modelValue": ($event) => form.value.address = $event,
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "city" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ville`);
          } else {
            return [
              createTextVNode("Ville")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "city",
        modelValue: form.value.cityValue,
        "onUpdate:modelValue": ($event) => form.value.cityValue = $event,
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "commune" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Commune`);
          } else {
            return [
              createTextVNode("Commune")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "commune",
        modelValue: form.value.communeValue,
        "onUpdate:modelValue": ($event) => form.value.communeValue = $event,
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "quartier" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Quartier`);
          } else {
            return [
              createTextVNode("Quartier")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "quartier",
        modelValue: form.value.quartierValue,
        "onUpdate:modelValue": ($event) => form.value.quartierValue = $event,
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { for: "country" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pays`);
          } else {
            return [
              createTextVNode("Pays")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "country",
        modelValue: form.value.countryValue,
        "onUpdate:modelValue": ($event) => form.value.countryValue = $event,
        class: "h-12 rounded-xl"
      }, null, _parent));
      _push(`</div><div class="flex flex-wrap items-center gap-6 pt-2"><label class="flex items-center gap-2 text-sm font-medium"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.isAvailable) ? ssrLooseContain(form.value.isAvailable, null) : form.value.isAvailable) ? " checked" : ""} type="checkbox" class="rounded border-input"> Visible / disponible </label><label class="flex items-center gap-2 text-sm font-medium"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.available) ? ssrLooseContain(form.value.available, null) : form.value.available) ? " checked" : ""} type="checkbox" class="rounded border-input"> Annonce active </label></div></div><div class="flex justify-end gap-3 border-t border-border pt-6">`);
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        type: "button",
        variant: "outline",
        class: "rounded-full",
        onClick: ($event) => unref(router).push("/dashboard/hotel/hotels")
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
        class: "rounded-full min-w-[160px]",
        disabled: !canSubmit.value || submitting.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (submitting.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` Enregistrer `);
          } else {
            return [
              submitting.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" Enregistrer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/hotels/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-DEJMTFW2.mjs.map
