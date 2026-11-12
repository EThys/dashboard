import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { RefreshCw, Plus, Search, Building2, Images, MapPin, BedDouble } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { a as useRouter, m as useAuthStore, j as joinApi, A as ApiEndpoints, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as unwrapArrayPayload } from './apiListResponse-BRFNgDZl.mjs';
import { f as formatListingPlace } from './propertyNormalizer-DiijNhdR.mjs';
import { l as lowestHotelRoomOffer } from './hotelStartingPrice-TSwrGxRW.mjs';
import { h as hotelTimeline } from './hotelTimeline-Kaah3oiT.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { _ as _sfc_main$2 } from './ListPagination-BYvyA4ig.mjs';
import { u as useAsyncData } from './asyncData-DaMIbxNX.mjs';
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
import './transactionDisplay-GAAD372w.mjs';
import './currency-BoakoUK-.mjs';

const PAGE_SIZE = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const page = ref(1);
    const search = ref("");
    const statusFilter = ref("all");
    const serverPage = ref(false);
    function handleNewHotel() {
      var _a;
      if (!((_a = auth.user) == null ? void 0 : _a.premium)) {
        toast.info("Abonnement requis", {
          description: "Un abonnement Premium est n\xE9cessaire pour publier un h\xF4tel."
        });
        return navigateTo("/compte/abonnement");
      }
      router.push("/dashboard/hotel/hotels/new");
    }
    function readHotelPage(raw) {
      var _a, _b;
      if (Array.isArray(raw)) {
        return { items: raw, total: raw.length, serverPaged: false };
      }
      if (!raw || typeof raw !== "object") return { items: [], total: 0, serverPaged: false };
      const body = raw;
      const items = Array.isArray(body.content) ? body.content : unwrapArrayPayload(raw);
      const declared = Number((_b = (_a = body.totalElements) != null ? _a : body.total) != null ? _b : body.totalCount);
      const hasDeclared = Number.isFinite(declared);
      return {
        items,
        total: hasDeclared ? declared : items.length,
        serverPaged: hasDeclared && declared !== items.length
      };
    }
    function readRooms(raw) {
      const rows = unwrapArrayPayload(raw);
      return rows.map((row) => {
        const room = row.chambre && typeof row.chambre === "object" ? row.chambre : row;
        return room;
      }).filter((room) => room && room.hotelId != null);
    }
    const { data, pending, refresh } = useAsyncData(
      "my-hotels-list",
      async () => {
        var _a;
        const apiBase = config.public.apiBase;
        const uid = (_a = auth.user) == null ? void 0 : _a.userId;
        if (!uid || !auth.token) {
          return { items: [], rooms: [], total: 0, serverPaged: false, failed: false };
        }
        const headers = { Authorization: `Bearer ${auth.token}` };
        const ownerUrl = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`);
        const pagedUrl = serverPage.value ? `${ownerUrl}?page=${page.value - 1}&size=${PAGE_SIZE}` : ownerUrl;
        try {
          const [hotelsRaw, roomsRaw] = await Promise.all([
            $fetch(pagedUrl, { headers }),
            $fetch(joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic)).catch(() => null)
          ]);
          const parsed = readHotelPage(hotelsRaw);
          return { ...parsed, rooms: readRooms(roomsRaw), failed: false };
        } catch {
          return { items: [], rooms: [], total: 0, serverPaged: false, failed: true };
        }
      },
      { server: false }
    );
    watch(
      () => {
        var _a;
        return (_a = data.value) == null ? void 0 : _a.serverPaged;
      },
      (paged) => {
        if (paged) serverPage.value = true;
      }
    );
    watch(page, () => {
      if (serverPage.value) refresh();
    });
    const kinshasaCommunes = /* @__PURE__ */ new Set([
      "bandalungwa",
      "barumbu",
      "bumbu",
      "gombe",
      "kalamu",
      "kasa-vubu",
      "kasavubu",
      "kimbanseke",
      "kinshasa",
      "kintambo",
      "kisenso",
      "lemba",
      "limete",
      "lingwala",
      "makala",
      "maluku",
      "masina",
      "matete",
      "mont-ngafula",
      "mont ngafula",
      "ndjili",
      "ngaba",
      "ngaliema",
      "ngiri-ngiri",
      "ngiri ngiri",
      "nsele",
      "selembao"
    ]);
    function fold(value) {
      return String(value != null ? value : "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }
    function text(value) {
      return String(value != null ? value : "").trim();
    }
    function clip(value, max = 88) {
      const clean = value.replace(/\s+/g, " ").trim();
      if (clean.length <= max) return clean;
      return `${clean.slice(0, max).trimEnd()}\u2026`;
    }
    function stayPeriod(raw) {
      const value = text(raw);
      if (!value || value.toLowerCase() === "null") return "";
      const lower = value.toLowerCase();
      if (lower.includes("heure") || lower.includes("hour") || lower.includes("/h")) return "par heure";
      if (lower.includes("nuit") || lower.includes("night")) return "par nuit";
      if (lower.includes("jour") || lower.includes("day")) return "par jour";
      if (lower.includes("semaine") || lower.includes("week")) return "par semaine";
      if (lower.includes("mois") || lower.includes("month")) return "par mois";
      return value;
    }
    function imagePaths(row, hotel) {
      const paths = [];
      const push = (value) => {
        const url = text(value);
        if (url && !paths.includes(url)) paths.push(url);
      };
      push(hotel.image);
      push(row.image);
      const images = row.images;
      if (Array.isArray(images)) {
        for (const image of images) {
          if (image && typeof image === "object") {
            const file = image;
            push(file.path || file.publicPath);
          } else {
            push(image);
          }
        }
      }
      const structure = Array.isArray(row.structure) ? row.structure : [];
      for (const entry of structure) {
        if (!entry || typeof entry !== "object") continue;
        const files = entry.image;
        if (!Array.isArray(files)) continue;
        for (const file of files) {
          if (file && typeof file === "object") {
            const image = file;
            push(image.path || image.publicPath);
          }
        }
      }
      return paths;
    }
    function roomsFor(row, hotel, catalog) {
      var _a;
      const structure = Array.isArray(row.structure) ? row.structure : [];
      const embedded = structure.map((entry) => entry && typeof entry === "object" ? entry.chambre : null).filter((room) => !!room);
      if (embedded.length) return embedded;
      const id = Number((_a = hotel.id) != null ? _a : hotel.hotelId);
      return catalog.filter((room) => Number(room.hotelId) === id);
    }
    const hotels = computed(() => {
      const payload = data.value;
      if (!payload) return [];
      return payload.items.map((row) => {
        var _a, _b;
        const hotel = row.hotel && typeof row.hotel === "object" ? row.hotel : row;
        const id = Number((_a = hotel.id) != null ? _a : hotel.hotelId);
        const rooms = roomsFor(row, hotel, payload.rooms);
        const offer = lowestHotelRoomOffer(rooms);
        const priced = rooms.filter((room) => Number(room.price) > 0 && room.available !== false).sort((a, b) => Number(a.price) - Number(b.price) || text(b.updatedAt).localeCompare(text(a.updatedAt)));
        const city = text(hotel.cityValue);
        const commune = text(hotel.communeValue);
        const resolvedCity = city || (kinshasaCommunes.has(fold(commune)) ? "Kinshasa" : "");
        const photos = imagePaths(row, hotel);
        const pieces = rooms.reduce((sum, room) => sum + (Number(room.numberPiece) > 0 ? Number(room.numberPiece) : 0), 0);
        const roomDates = rooms.flatMap((room) => [room.createdAt, room.updatedAt]);
        const dates = hotelTimeline({
          createdAt: hotel.createdAt,
          updatedAt: hotel.updatedAt,
          imageUrls: photos,
          roomDates
        });
        return {
          id,
          title: text(hotel.title) || "Sans titre",
          description: clip(text(hotel.description)),
          place: formatListingPlace({
            address: hotel.address,
            quartierValue: hotel.quartierValue,
            communeValue: hotel.communeValue,
            cityValue: resolvedCity,
            countryValue: hotel.countryValue
          }) || "Adresse non renseign\xE9e",
          cover: photos[0] || "",
          photoCount: photos.length,
          online: hotel.sold !== true && hotel.available !== false,
          createdLabel: dates.createdLabel,
          updatedLabel: dates.updatedLabel,
          roomCount: rooms.length,
          availableRooms: rooms.filter((room) => room.available !== false).length,
          pieces,
          priceLabel: (offer == null ? void 0 : offer.label) || "Tarifs par chambre",
          period: stayPeriod((_b = priced[0]) == null ? void 0 : _b.priceHeure),
          postalCode: text(hotel.postalCode)
        };
      });
    });
    const filtered = computed(() => {
      const needle = fold(search.value);
      return hotels.value.filter((hotel) => {
        if (statusFilter.value === "online" && !hotel.online) return false;
        if (statusFilter.value === "offline" && hotel.online) return false;
        if (!needle) return true;
        return fold(`${hotel.title} ${hotel.description} ${hotel.place} ${hotel.postalCode}`).includes(needle);
      });
    });
    const pageItems = computed(() => {
      var _a;
      if ((_a = data.value) == null ? void 0 : _a.serverPaged) return filtered.value;
      const start = (page.value - 1) * PAGE_SIZE;
      return filtered.value.slice(start, start + PAGE_SIZE);
    });
    const pagerTotal = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.serverPaged) ? data.value.total : filtered.value.length;
    });
    const showShimmer = computed(() => {
      var _a;
      return pending.value && hotels.value.length === 0 && !((_a = data.value) == null ? void 0 : _a.failed);
    });
    const counts = computed(() => ({
      total: hotels.value.length,
      online: hotels.value.filter((hotel) => hotel.online).length,
      offline: hotels.value.filter((hotel) => !hotel.online).length,
      rooms: hotels.value.reduce((sum, hotel) => sum + hotel.roomCount, 0)
    }));
    watch([search, statusFilter], () => {
      page.value = 1;
    });
    watch(filtered, (list) => {
      var _a;
      if ((_a = data.value) == null ? void 0 : _a.serverPaged) return;
      const last = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (page.value > last) page.value = last;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1976D2]">H\xF4tellerie</p><h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Mes \xE9tablissements</h1><p class="mt-1 max-w-xl text-sm text-slate-500"> Adresse, photos, chambres et tarif le plus bas renvoy\xE9s pour chacun de vos h\xF4tels. </p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        class: "rounded-full",
        disabled: unref(pending),
        onClick: ($event) => unref(refresh)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCw), {
              class: ["mr-2 h-4 w-4", { "animate-spin": unref(pending) }]
            }, null, _parent2, _scopeId));
            _push2(` Actualiser `);
          } else {
            return [
              createVNode(unref(RefreshCw), {
                class: ["mr-2 h-4 w-4", { "animate-spin": unref(pending) }]
              }, null, 8, ["class"]),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "rounded-full bg-[#1976D2] hover:bg-[#1565C0]",
        onClick: handleNewHotel
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Nouvel h\xF4tel `);
          } else {
            return [
              createVNode(unref(Plus), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Nouvel h\xF4tel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><!--[-->`);
      ssrRenderList([
        { label: "\xC9tablissements", value: counts.value.total },
        { label: "En ligne", value: counts.value.online },
        { label: "Hors ligne", value: counts.value.offline },
        { label: "Chambres", value: counts.value.rooms }
      ], (stat) => {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${ssrInterpolate(stat.label)}</p>`);
        if (showShimmer.value) {
          _push(`<div class="mt-2 h-8 w-12 rounded-lg casa-shimmer-slate"></div>`);
        } else {
          _push(`<p class="mt-1 text-2xl font-black text-slate-900">${ssrInterpolate(stat.value)}</p>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"><div class="relative min-w-0 flex-1">`);
      _push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", search.value)} type="search" placeholder="Nom, adresse, quartier\u2026" class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#1976D2] focus:bg-white"></div><div class="flex rounded-xl bg-slate-100 p-1"><!--[-->`);
      ssrRenderList([
        { id: "all", label: "Tous" },
        { id: "online", label: "En ligne" },
        { id: "offline", label: "Hors ligne" }
      ], (option) => {
        _push(`<button type="button" class="${ssrRenderClass([statusFilter.value === option.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800", "rounded-lg px-3 py-2 text-xs font-bold transition"])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if ((_a = unref(data)) == null ? void 0 : _a.failed) {
        _push(`<p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"> Les \xE9tablissements n\u2019ont pas pu \xEAtre charg\xE9s. <button type="button" class="ml-2 font-bold underline">R\xE9essayer</button></p>`);
      } else {
        _push(`<!---->`);
      }
      if (showShimmer.value) {
        _push(`<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(PAGE_SIZE, (i) => {
          _push(`<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div class="aspect-[16/10] casa-shimmer-slate"></div><div class="space-y-3 p-5"><div class="h-5 w-2/3 rounded-lg casa-shimmer-slate"></div><div class="h-3 w-full rounded-lg casa-shimmer-slate"></div><div class="h-3 w-4/5 rounded-lg casa-shimmer-slate"></div><div class="grid grid-cols-2 gap-2 pt-2"><div class="h-14 rounded-xl casa-shimmer-slate"></div><div class="h-14 rounded-xl casa-shimmer-slate"></div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!filtered.value.length) {
        _push(`<div class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">`);
        _push(ssrRenderComponent(unref(Building2), { class: "mx-auto h-12 w-12 text-slate-300" }, null, _parent));
        _push(`<p class="mt-4 font-bold text-slate-900">${ssrInterpolate(hotels.value.length ? "Aucun \xE9tablissement pour ce filtre" : "Aucun h\xF4tel pour l\u2019instant")}</p><p class="mx-auto mt-1 max-w-sm text-sm text-slate-500">${ssrInterpolate(hotels.value.length ? "Modifiez la recherche ou le statut." : "Cr\xE9ez votre premier \xE9tablissement pour proposer des chambres.")}</p>`);
        if (!hotels.value.length) {
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            class: "mt-6 rounded-full bg-[#1976D2] hover:bg-[#1565C0]",
            onClick: handleNewHotel
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Cr\xE9er un h\xF4tel `);
              } else {
                return [
                  createTextVNode(" Cr\xE9er un h\xF4tel ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(pageItems.value, (hotel) => {
          _push(`<article class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#1976D2]/40 hover:shadow-md"><div class="relative aspect-[16/10] bg-slate-100">`);
          if (hotel.cover) {
            _push(`<img${ssrRenderAttr("src", hotel.cover)}${ssrRenderAttr("alt", hotel.title)} class="h-full w-full object-cover transition duration-300 group-hover:scale-105">`);
          } else {
            _push(`<div class="flex h-full items-center justify-center text-slate-300">`);
            _push(ssrRenderComponent(unref(Building2), { class: "h-12 w-12" }, null, _parent));
            _push(`</div>`);
          }
          _push(`<span class="${ssrRenderClass([hotel.online ? "bg-emerald-600" : "bg-slate-600", "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"])}">${ssrInterpolate(hotel.online ? "En ligne" : "Hors ligne")}</span>`);
          if (hotel.photoCount) {
            _push(`<span class="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">`);
            _push(ssrRenderComponent(unref(Images), { class: "h-3.5 w-3.5" }, null, _parent));
            _push(` ${ssrInterpolate(hotel.photoCount)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="absolute bottom-3 left-3 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#1565C0] shadow">${ssrInterpolate(hotel.priceLabel)} `);
          if (hotel.period && hotel.priceLabel !== "Tarifs par chambre") {
            _push(`<span class="font-semibold text-slate-500"> \xB7 ${ssrInterpolate(hotel.period)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></div><div class="flex flex-1 flex-col gap-3 p-5"><div><h2 class="line-clamp-2 text-lg font-black leading-tight text-slate-900 group-hover:text-[#1565C0]">${ssrInterpolate(hotel.title)}</h2>`);
          if (hotel.description) {
            _push(`<p class="mt-1 truncate text-sm text-slate-500">${ssrInterpolate(hotel.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="flex items-start gap-1.5 text-xs text-slate-500">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1976D2]" }, null, _parent));
          _push(`<span class="line-clamp-2">${ssrInterpolate(hotel.place)}`);
          if (hotel.postalCode) {
            _push(`<!--[--> \xB7 ${ssrInterpolate(hotel.postalCode)}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></p><div class="rounded-xl bg-slate-50 px-3 py-2"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chambres</p><p class="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate-900">`);
          _push(ssrRenderComponent(unref(BedDouble), { class: "h-3.5 w-3.5 text-[#1976D2]" }, null, _parent));
          _push(` ${ssrInterpolate(hotel.roomCount)} <span class="font-medium text-slate-400">\xB7 ${ssrInterpolate(hotel.availableRooms)} dispo</span>`);
          if (hotel.pieces) {
            _push(`<span class="font-medium text-slate-400">\xB7 ${ssrInterpolate(hotel.pieces)} pi\xE8ce${ssrInterpolate(hotel.pieces > 1 ? "s" : "")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400"><span>Cr\xE9\xE9 ${ssrInterpolate(hotel.createdLabel || "\u2014")}</span>`);
          if (hotel.updatedLabel) {
            _push(`<span>Maj ${ssrInterpolate(hotel.updatedLabel)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (!showShimmer.value && pagerTotal.value > 0) {
        _push(ssrRenderComponent(_sfc_main$2, {
          page: page.value,
          total: pagerTotal.value,
          "page-size": PAGE_SIZE,
          "onUpdate:page": ($event) => page.value = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/hotels/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D2IfNJeH.mjs.map
