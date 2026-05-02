import { defineComponent, computed, withAsyncContext, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { ArrowLeft, MapPin, Plus, Loader2, ImageIcon, BedDouble } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$4 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$3 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$2 } from './Badge-CZaU8sYj.mjs';
import { m as useRoute, a as useRouter, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { u as useAsyncData } from './asyncData-cMiNwecB.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../nitro/nitro.mjs';
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
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const hotelId = computed(() => Number(route.params.id));
    const { data: hotelRow, pending: pendingHotel, refresh: refreshHotel } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "manager-hotel-detail",
      async () => {
        var _a, _b, _c;
        const apiBase = config.public.apiBase;
        const uid = (_a = auth.user) == null ? void 0 : _a.userId;
        if (!uid || !auth.token) return null;
        const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`);
        const res = await $fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } });
        const list = (_c = (_b = res == null ? void 0 : res.data) != null ? _b : res) != null ? _c : [];
        const arr = Array.isArray(list) ? list : [];
        return arr.find((row) => {
          var _a2, _b2;
          const h = (_a2 = row == null ? void 0 : row.hotel) != null ? _a2 : row;
          const hid = (_b2 = h == null ? void 0 : h.id) != null ? _b2 : h == null ? void 0 : h.hotelId;
          return Number(hid) === hotelId.value;
        });
      },
      { watch: [hotelId], server: false }
    )), __temp = await __temp, __restore(), __temp);
    const hotel = computed(() => {
      var _a, _b;
      return (_b = (_a = hotelRow.value) == null ? void 0 : _a.hotel) != null ? _b : hotelRow.value;
    });
    const { data: roomsRes, pending: pendingRooms, refresh: refreshRooms } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "manager-hotel-rooms",
      async () => {
        const apiBase = config.public.apiBase;
        const url = joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic);
        return $fetch(url).catch(() => null);
      },
      { watch: [hotelId], server: false }
    )), __temp = await __temp, __restore(), __temp);
    function parseRooms(raw) {
      var _a, _b, _c, _d;
      const list = (_d = (_c = (_b = (_a = raw == null ? void 0 : raw.data) != null ? _a : raw == null ? void 0 : raw.chambre) != null ? _b : raw == null ? void 0 : raw.chambres) != null ? _c : raw) != null ? _d : [];
      const arr = Array.isArray(list) ? list : [];
      return arr.map((x) => {
        var _a2;
        return (_a2 = x.chambre) != null ? _a2 : x;
      }).filter((ch) => {
        var _a2, _b2;
        return Number((_b2 = ch.hotelId) != null ? _b2 : (_a2 = ch.hotel) == null ? void 0 : _a2.id) === hotelId.value;
      });
    }
    function roomsFromStructure(row) {
      const structure = row == null ? void 0 : row.structure;
      if (!Array.isArray(structure) || !structure.length) return [];
      const out = [];
      for (const s of structure) {
        const c = s.chambre;
        if (!c) continue;
        if (Number(c.hotelId) !== hotelId.value) continue;
        const rawImgs = s.image;
        const paths = Array.isArray(rawImgs) ? rawImgs.map((im) => im.path || im.publicPath).filter(Boolean) : [];
        out.push({
          ...c,
          _cover: paths[0] || "",
          _paths: paths
        });
      }
      return out;
    }
    function roomCover(r) {
      var _a, _b, _c, _d;
      return r._cover || r.image || ((_b = (_a = r.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.path) || ((_d = (_c = r.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.image) || "";
    }
    const rooms = computed(() => {
      const row = hotelRow.value;
      const fromStruct = roomsFromStructure(row);
      if (fromStruct.length) return fromStruct;
      return parseRooms(roomsRes.value).map((r) => {
        var _a, _b, _c, _d;
        return {
          ...r,
          _cover: ((_b = (_a = r.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.path) || ((_d = (_c = r.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.image) || r.image || "",
          _paths: Array.isArray(r.images) ? r.images.map((x) => x.path || x.image).filter(Boolean) : []
        };
      });
    });
    const showRoomModal = ref(false);
    const roomDetailOpen = ref(false);
    const selectedRoom = ref(null);
    const roomSubmitting = ref(false);
    const roomImageFiles = ref([]);
    const roomPreviewUrls = ref([]);
    const roomFileInputRef = ref(null);
    const roomForm = ref({
      title: "",
      description: "",
      numberPiece: 1,
      price: 0,
      priceHeure: "",
      deviseId: 2,
      isAvailable: true,
      available: true
    });
    function revokeRoomPreviews() {
      roomPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u));
      roomPreviewUrls.value = [];
    }
    function clearRoomImages() {
      revokeRoomPreviews();
      roomImageFiles.value = [];
      if (roomFileInputRef.value) roomFileInputRef.value.value = "";
    }
    function closeRoomDetail() {
      roomDetailOpen.value = false;
      selectedRoom.value = null;
    }
    function roomImageUrls(r) {
      const out = [];
      const paths = r._paths;
      if (Array.isArray(paths)) {
        for (const p of paths) if (typeof p === "string" && p) out.push(p);
      }
      const cover = roomCover(r);
      if (cover) out.unshift(cover);
      return [...new Set(out.filter(Boolean))];
    }
    watch(showRoomModal, (open) => {
      if (!open) {
        clearRoomImages();
        roomForm.value = {
          title: "",
          description: "",
          numberPiece: 1,
          price: 0,
          priceHeure: "",
          deviseId: 2,
          isAvailable: true,
          available: true
        };
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-10" }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "ghost",
        size: "icon",
        class: "rounded-full shrink-0",
        onClick: ($event) => unref(router).push("/dashboard/hotel/hotels")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-5 w-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-5 w-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">\xC9tablissement</p><h1 class="text-2xl font-black md:text-3xl">${ssrInterpolate(((_a = hotel.value) == null ? void 0 : _a.title) || "\u2026")}</h1><p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 shrink-0" }, null, _parent));
      _push(` ${ssrInterpolate((_b = hotel.value) == null ? void 0 : _b.address)} \xB7 ${ssrInterpolate((_c = hotel.value) == null ? void 0 : _c.cityValue)}</p></div></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        size: "sm",
        disabled: unref(pendingHotel),
        onClick: ($event) => unref(refreshHotel)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Actualiser`);
          } else {
            return [
              createTextVNode("Actualiser")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "rounded-full",
        onClick: ($event) => showRoomModal.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Nouvelle chambre `);
          } else {
            return [
              createVNode(unref(Plus), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Nouvelle chambre ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(pendingHotel)) {
        _push(`<div class="flex justify-center py-16 text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-8 w-8 animate-spin" }, null, _parent));
        _push(`</div>`);
      } else if (!hotel.value) {
        _push(`<div class="rounded-2xl border border-blue-200/80 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800/50 p-8 text-center text-sm text-foreground"> H\xF4tel introuvable pour votre compte. </div>`);
      } else {
        _push(`<!--[--><div class="grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"><div class="aspect-[2/1] bg-muted">`);
        if (hotel.value.image) {
          _push(`<img${ssrRenderAttr("src", hotel.value.image)}${ssrRenderAttr("alt", hotel.value.title)} class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex h-full items-center justify-center text-muted-foreground">`);
          _push(ssrRenderComponent(unref(ImageIcon), { class: "h-16 w-16 opacity-25" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div><div class="p-6"><p class="text-muted-foreground leading-relaxed">${ssrInterpolate(hotel.value.description || "Ajoutez une description depuis l\u2019API ou contactez le support.")}</p></div></div><div class="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3 text-sm"><h3 class="font-bold">R\xE9sum\xE9</h3><div class="flex justify-between gap-4"><span class="text-muted-foreground">ID</span><span class="font-mono">${ssrInterpolate(hotel.value.id)}</span></div><div class="flex justify-between gap-4"><span class="text-muted-foreground">Statut</span>`);
        if (hotel.value.isAvailable !== false) {
          _push(ssrRenderComponent(unref(_sfc_main$2), { variant: "default" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ouvert`);
              } else {
                return [
                  createTextVNode("Ouvert")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(unref(_sfc_main$2), { variant: "secondary" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ferm\xE9`);
              } else {
                return [
                  createTextVNode("Ferm\xE9")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div></div><div><div class="mb-4 flex items-center justify-between"><h2 class="text-xl font-black">Chambres</h2><span class="text-sm text-muted-foreground">${ssrInterpolate(rooms.value.length)} type(s)</span></div>`);
        if (unref(pendingRooms)) {
          _push(`<div class="flex justify-center py-12">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "h-6 w-6 animate-spin text-muted-foreground" }, null, _parent));
          _push(`</div>`);
        } else if (!rooms.value.length) {
          _push(`<div class="rounded-2xl border border-dashed py-14 text-center text-sm text-muted-foreground"> Aucune chambre \u2014 ajoutez votre premi\xE8re offre. </div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(rooms.value, (r, i) => {
            _push(`<div class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md" role="button" tabindex="0"><div class="relative aspect-[5/3] bg-muted">`);
            if (roomCover(r)) {
              _push(`<img${ssrRenderAttr("src", roomCover(r))} class="h-full w-full object-cover transition group-hover:scale-[1.02]" alt="">`);
            } else {
              _push(`<div class="flex h-full items-center justify-center">`);
              _push(ssrRenderComponent(unref(BedDouble), { class: "h-10 w-10 text-muted-foreground/40" }, null, _parent));
              _push(`</div>`);
            }
            _push(`<div class="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">${ssrInterpolate(r.price)} ${ssrInterpolate(r.deviseId === 1 ? "CDF" : "USD")} `);
            if (r.priceHeure) {
              _push(`<span class="text-muted-foreground font-normal">\xB7 ${ssrInterpolate(r.priceHeure)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="p-4 space-y-1"><h3 class="font-bold leading-snug">${ssrInterpolate(r.title)}</h3><p class="line-clamp-2 text-xs text-muted-foreground">${ssrInterpolate(r.description)}</p>`);
            _push(ssrRenderComponent(unref(_sfc_main$2), {
              variant: "outline",
              class: "mt-2 text-[10px]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`#${ssrInterpolate(r.id)}`);
                } else {
                  return [
                    createTextVNode("#" + toDisplayString(r.id), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a2;
        if (roomDetailOpen.value && selectedRoom.value) {
          _push2(`<div class="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true"><div class="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"><div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4"><div class="min-w-0"><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chambre</p><h3 class="truncate text-lg font-black">${ssrInterpolate(selectedRoom.value.title)}</h3></div>`);
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            class: "rounded-full",
            onClick: closeRoomDetail
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div><div class="space-y-6 p-6">`);
          if (roomImageUrls(selectedRoom.value).length) {
            _push2(`<div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
            ssrRenderList(roomImageUrls(selectedRoom.value), (src, idx) => {
              _push2(`<div class="aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 text-sm sm:grid-cols-2"><div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix / nuit</p><p class="mt-1 text-2xl font-black text-primary">${ssrInterpolate(selectedRoom.value.price)} ${ssrInterpolate(selectedRoom.value.deviseId === 1 ? "CDF" : "USD")}</p></div>`);
          if (selectedRoom.value.priceHeure) {
            _push2(`<div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Infos horaires</p><p class="mt-1 text-foreground">${ssrInterpolate(selectedRoom.value.priceHeure)}</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pi\xE8ces</p><p class="mt-1 text-foreground">${ssrInterpolate((_a2 = selectedRoom.value.numberPiece) != null ? _a2 : "\u2014")}</p></div><div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</p><p class="mt-1 font-mono text-foreground">#${ssrInterpolate(selectedRoom.value.id)}</p></div></div><div class="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm"><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</p><p class="mt-2 whitespace-pre-line text-foreground">${ssrInterpolate(selectedRoom.value.description || "\u2014")}</p></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (showRoomModal.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"><div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl"><h3 class="text-lg font-bold">Nouvelle chambre</h3><p class="text-sm text-muted-foreground">Tarif nuit, capacit\xE9 et visuel \u2014 comme sur les meilleures plateformes.</p><form class="mt-6 space-y-4"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "rt" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Titre *`);
              } else {
                return [
                  createTextVNode("Titre *")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            id: "rt",
            modelValue: roomForm.value.title,
            "onUpdate:modelValue": ($event) => roomForm.value.title = $event,
            class: "h-11 rounded-xl",
            placeholder: "Suite vue jardin"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "rd" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Description`);
              } else {
                return [
                  createTextVNode("Description")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<textarea id="rd" rows="3" class="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">${ssrInterpolate(roomForm.value.description)}</textarea></div><div class="grid grid-cols-2 gap-3"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Prix / nuit`);
              } else {
                return [
                  createTextVNode("Prix / nuit")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.price,
            "onUpdate:modelValue": ($event) => roomForm.value.price = $event,
            modelModifiers: { number: true },
            type: "number",
            step: "0.01",
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Pi\xE8ces / couchage`);
              } else {
                return [
                  createTextVNode("Pi\xE8ces / couchage")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.numberPiece,
            "onUpdate:modelValue": ($event) => roomForm.value.numberPiece = $event,
            modelModifiers: { number: true },
            type: "number",
            min: "1",
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Info horaire (optionnel)`);
              } else {
                return [
                  createTextVNode("Info horaire (optionnel)")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.priceHeure,
            "onUpdate:modelValue": ($event) => roomForm.value.priceHeure = $event,
            class: "h-11 rounded-xl",
            placeholder: "ex. Check-in 14h"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Devise`);
              } else {
                return [
                  createTextVNode("Devise")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<select class="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"><option${ssrRenderAttr("value", 2)}${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.deviseId) ? ssrLooseContain(roomForm.value.deviseId, 2) : ssrLooseEqual(roomForm.value.deviseId, 2)) ? " selected" : ""}>USD</option><option${ssrRenderAttr("value", 1)}${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.deviseId) ? ssrLooseContain(roomForm.value.deviseId, 1) : ssrLooseEqual(roomForm.value.deviseId, 1)) ? " selected" : ""}>CDF</option></select></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "room-files" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Photos`);
              } else {
                return [
                  createTextVNode("Photos")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<p class="text-xs text-muted-foreground">Plusieurs fichiers possibles \u2014 envoy\xE9s en base64 (data URL) \xE0 la cr\xE9ation.</p><div class="flex flex-wrap items-center gap-2"><label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-3 py-2 text-sm font-medium hover:bg-muted/50">`);
          _push2(ssrRenderComponent(unref(ImageIcon), { class: "h-4 w-4 text-muted-foreground" }, null, _parent));
          _push2(` Choisir des images <input id="room-files" type="file" accept="image/*" multiple class="sr-only"></label>`);
          if (roomImageFiles.value.length) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              variant: "ghost",
              size: "sm",
              class: "rounded-full",
              onClick: clearRoomImages
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Tout retirer `);
                } else {
                  return [
                    createTextVNode(" Tout retirer ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (roomPreviewUrls.value.length) {
            _push2(`<div class="mt-2 grid grid-cols-3 gap-2"><!--[-->`);
            ssrRenderList(roomPreviewUrls.value, (src, i) => {
              _push2(`<div class="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex gap-4 pt-2"><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.isAvailable) ? ssrLooseContain(roomForm.value.isAvailable, null) : roomForm.value.isAvailable) ? " checked" : ""} type="checkbox" class="rounded"> Disponible </label><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.available) ? ssrLooseContain(roomForm.value.available, null) : roomForm.value.available) ? " checked" : ""} type="checkbox" class="rounded"> Publi\xE9e </label></div><div class="flex justify-end gap-2 pt-4 border-t">`);
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
            type: "button",
            variant: "outline",
            class: "rounded-full",
            onClick: ($event) => showRoomModal.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
            type: "submit",
            class: "rounded-full",
            disabled: roomSubmitting.value
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                if (roomSubmitting.value) {
                  _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push3(`<!---->`);
                }
                _push3(` Cr\xE9er `);
              } else {
                return [
                  roomSubmitting.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 h-4 w-4 animate-spin"
                  })) : createCommentVNode("", true),
                  createTextVNode(" Cr\xE9er ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/hotels/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DO8OocNR.mjs.map
