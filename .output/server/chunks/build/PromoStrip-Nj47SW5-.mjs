import { defineComponent, withAsyncContext, computed, ref, watch, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, M as MIGRATION_API_ORIGIN } from './server.mjs';
import { u as useAsyncData } from './asyncData-DaMIbxNX.mjs';

function resolvePubImage(imagePath) {
  const raw = imagePath.trim();
  if (!raw || raw.toLowerCase() === "null") return "";
  if (raw.startsWith("data:image") || raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  const compact = raw.replace(/\s/g, "");
  if (compact.length > 80 && !compact.includes("/") && !compact.includes(".")) {
    return `data:image/jpeg;base64,${compact}`;
  }
  if (raw.startsWith("/")) return `${MIGRATION_API_ORIGIN}${raw}`;
  return `${MIGRATION_API_ORIGIN}/storage/${raw.replace(/^\/+/, "")}`;
}
function asText(value) {
  const text = value == null ? "" : String(value).trim();
  return text.toLowerCase() === "null" ? "" : text;
}
function asBool(value, fallback = true) {
  if (value == null) return fallback;
  if (typeof value === "boolean") return value;
  const text = String(value).toLowerCase();
  if (text === "true" || text === "1") return true;
  if (text === "false" || text === "0") return false;
  return fallback;
}
function asId(value) {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}
function parsePublicityList(body) {
  const rows = rowsOf(body);
  return rows.map((row) => {
    var _a, _b, _c, _d;
    const imagePath = asText((_b = (_a = row.imagePath) != null ? _a : row.image) != null ? _b : row.path);
    const title = asText(row.title);
    return {
      id: asId(row.id),
      userId: asId((_c = row.user) != null ? _c : row.userId),
      title,
      description: asText(row.description),
      imagePath,
      imageUrl: resolvePubImage(imagePath),
      isActive: asBool((_d = row.isActive) != null ? _d : row.active, true),
      createdAt: asText(row.createdAt)
    };
  }).filter((ad) => ad.title.length > 0);
}
function rowsOf(body) {
  if (Array.isArray(body)) {
    return body.filter((row) => row && typeof row === "object");
  }
  if (!body || typeof body !== "object") return [];
  for (const value of Object.values(body)) {
    if (Array.isArray(value)) return rowsOf(value);
    if (value && typeof value === "object") {
      const nested = rowsOf(value);
      if (nested.length) return nested;
    }
  }
  return [];
}
async function fetchPublicAds(apiBase) {
  const body = await $fetch(joinApi(apiBase, ApiEndpoints.publicPubs));
  return parsePublicityList(body).filter((ad) => ad.isActive);
}
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PromoStrip",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "public-pubs",
      () => fetchPublicAds(config.public.apiBase),
      { server: false, lazy: true, default: () => [] }
    )), __temp = await __temp, __restore(), __temp);
    const ads = computed(() => {
      var _a;
      return (_a = data.value) != null ? _a : [];
    });
    const index = ref(0);
    const reduceMotion = ref(false);
    let timer = null;
    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }
    function start() {
      stop();
      if (reduceMotion.value || ads.value.length < 2) return;
      timer = setInterval();
    }
    watch(ads, () => {
      if (index.value >= ads.value.length) index.value = 0;
      start();
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(ads).length) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          class: "py-8",
          "aria-label": "Promotion"
        }, _attrs))}><div class="container mx-auto px-4"><div class="mb-4"><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#1976D2]">Promotion</p><h2 class="text-2xl font-black tracking-tight text-slate-900">Offres du moment</h2></div><div class="group relative h-56 overflow-hidden rounded-3xl bg-slate-900 shadow-sm sm:h-72 md:h-80"><div class="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none" style="${ssrRenderStyle({ transform: `translateX(-${unref(index) * 100}%)` })}"><!--[-->`);
        ssrRenderList(unref(ads), (ad) => {
          _push(`<article class="relative h-full min-w-full shrink-0 basis-full">`);
          if (ad.imageUrl) {
            _push(`<img${ssrRenderAttr("src", ad.imageUrl)}${ssrRenderAttr("alt", ad.title)} class="absolute inset-0 h-full w-full object-cover">`);
          } else {
            _push(`<div class="absolute inset-0 bg-gradient-to-br from-[#1976D2] to-[#64B5F6]"></div>`);
          }
          _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div><span class="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black tracking-wide text-[#1976D2]"> PUB </span><div class="absolute inset-x-0 bottom-0 p-5 pr-16 sm:p-7 sm:pr-20"><h3 class="line-clamp-1 text-xl font-black text-white sm:text-2xl">${ssrInterpolate(ad.title)}</h3>`);
          if (ad.description) {
            _push(`<p class="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">${ssrInterpolate(ad.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
        if (unref(ads).length > 1) {
          _push(`<!--[--><div class="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-3 sm:px-4"><button type="button" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70" aria-label="Publicit\xE9 pr\xE9c\xE9dente">`);
          _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5" }, null, _parent));
          _push(`</button><button type="button" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-2.5 text-white backdrop-blur-md hover:bg-black/70" aria-label="Publicit\xE9 suivante">`);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "h-5 w-5" }, null, _parent));
          _push(`</button></div><div class="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-6"><!--[-->`);
          ssrRenderList(unref(ads), (ad, dot) => {
            _push(`<button type="button" class="${ssrRenderClass([dot === unref(index) ? "w-6 bg-white" : "w-1.5 bg-white/50", "h-1.5 rounded-full transition-all"])}"${ssrRenderAttr("aria-label", `Publicit\xE9 ${dot + 1}`)}></button>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/PromoStrip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PromoStrip-Nj47SW5-.mjs.map
