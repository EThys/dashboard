import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { d as decodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { p as publicServicePath, b as publicVacancePath, c as publicPropertyPath } from './openListingLink-UP60yfaJ.mjs';
import { o as useRoute } from './server.mjs';
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

const playStore = "https://play.google.com/store/apps/details?id=com.casa.casa.casa";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const listingId = computed(() => {
      const raw = String(route.params.id || "");
      if (/^\d+$/.test(raw)) return Number(raw);
      const decoded = decodeId(raw);
      return decoded > 0 ? decoded : 0;
    });
    const listingType = computed(() => String(route.params.type || ""));
    const kind = computed(() => {
      const value = route.query.kind;
      return typeof value === "string" ? value : "property";
    });
    const websitePath = computed(() => {
      if (listingType.value === "service") return publicServicePath(listingId.value);
      if (kind.value === "vacance") return publicVacancePath(listingId.value);
      return publicPropertyPath(listingId.value, kind.value);
    });
    const appPath = computed(() => {
      const type = listingType.value === "service" ? "service" : "property";
      const query = type === "property" ? `?kind=${encodeURIComponent(kind.value)}` : "";
      const token = encodeURIComponent(String(route.params.id || ""));
      return `open/${type}/${token}${query}`;
    });
    const androidIntent = computed(() => {
      const fallback = encodeURIComponent(playStore);
      return `intent://${appPath.value}#Intent;scheme=casanayo;package=com.casa.casa.casa;S.browser_fallback_url=${fallback};end`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center" }, _attrs))}><p class="text-lg font-black">Ouverture de CasaNayo\u2026</p><p class="max-w-sm text-sm text-muted-foreground"> Si l\u2019application est install\xE9e, la fiche s\u2019ouvre. Sinon, la boutique s\u2019affiche. </p><div class="flex flex-wrap justify-center gap-3"><a${ssrRenderAttr("href", unref(androidIntent))} class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">Ouvrir l\u2019annonce</a><a${ssrRenderAttr("href", unref(websitePath))} class="rounded-full border border-border px-4 py-2 text-sm font-bold">Voir sur le site</a></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/open/[type]/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C6u6E-UB.mjs.map
