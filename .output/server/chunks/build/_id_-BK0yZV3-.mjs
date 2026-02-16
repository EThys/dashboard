import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, createBlock, openBlock, Fragment, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Printer, FileDown, Loader2, UserCheck, UserMinus, ShieldCheck, Maximize2, MapPin, Mail, Phone, CreditCard, ShieldAlert, Image, Tag, Home, Briefcase, Clock, CheckCircle2 } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$5 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$4 } from './CardTitle-CY-VC8BI.mjs';
import { _ as _sfc_main$3 } from './Badge-DOGV3Qys.mjs';
import { _ as _sfc_main$2 } from './Skeleton-BgOY-K4r.mjs';
import { e as useAuthStore, m as useMembersStore, b as usePropertyStore, d as useServiceStore } from './server.mjs';
import { toast } from 'vue-sonner';
import VueEasyLightbox from 'vue-easy-lightbox';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    useAuthStore();
    const membersStore = useMembersStore();
    const propertyStore = usePropertyStore();
    const serviceStore = useServiceStore();
    const userId = route.params.id;
    const user = ref(null);
    const member = ref(null);
    const isLoading = ref(true);
    const isUpdating = ref(false);
    const isVisible = ref(false);
    const imgIndex = ref(0);
    const lightboxImgs = computed(() => {
      var _a, _b, _c;
      const images = [];
      if (((_a = member.value) == null ? void 0 : _a.images) && member.value.images !== "string") images.push(member.value.images);
      if (((_b = member.value) == null ? void 0 : _b.cardFront) && member.value.cardFront !== "string") images.push(member.value.cardFront);
      if (((_c = member.value) == null ? void 0 : _c.cardBack) && member.value.cardBack !== "string") images.push(member.value.cardBack);
      return images;
    });
    const userProperties = computed(() => {
      const id = Number(userId);
      const residential = propertyStore.properties.filter((p) => {
        var _a;
        return ((_a = p.property) == null ? void 0 : _a.userId) === id;
      }).map((p) => {
        var _a, _b, _c, _d, _e;
        return {
          id: p.property.propertyId,
          title: p.property.title,
          type: "R\xE9sidentiel",
          price: p.property.price,
          currency: (_a = p.devise) == null ? void 0 : _a.code,
          transactionType: p.property.transactionType,
          address: (_b = p.address) == null ? void 0 : _b.address,
          // Residentiel properties have images.main array
          image: ((_e = (_d = (_c = p.images) == null ? void 0 : _c.main) == null ? void 0 : _d[0]) == null ? void 0 : _e.path) || p.image
        };
      });
      const specialized = [
        ...propertyStore.terrains.map((t) => ({ data: t.terrain, type: "Terrain", raw: t })),
        ...propertyStore.bureaux.map((b) => ({ data: b.bureau, type: "Bureau", raw: b })),
        ...propertyStore.festives.map((f) => ({ data: f.festive, type: "Espace Festif", raw: f })),
        ...propertyStore.funeraires.map((f) => ({ data: f.funeraire, type: "Espace Fun\xE9raire", raw: f })),
        ...propertyStore.hotels.map((h) => ({ data: h.hotel, type: "H\xF4tel", raw: h }))
      ].filter((item) => {
        var _a;
        return ((_a = item.data) == null ? void 0 : _a.userId) === id;
      }).map((item) => {
        var _a, _b, _c, _d;
        return {
          id: item.data.id,
          title: item.data.title,
          type: item.type,
          price: item.data.price,
          currency: (_a = item.raw.devise) == null ? void 0 : _a.code,
          transactionType: item.data.transactionType,
          address: (_b = item.raw.address) == null ? void 0 : _b.address,
          image: ((_d = (_c = item.raw.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.path) || item.raw.image
        };
      });
      return [...residential, ...specialized];
    });
    const userServices = computed(() => {
      const id = Number(userId);
      return serviceStore.services.filter((s) => {
        var _a;
        return ((_a = s.prestation) == null ? void 0 : _a.userId) === id;
      });
    });
    const toggleCertification = async () => {
      if (!user.value) return;
      isUpdating.value = true;
      const newStatus = !user.value.certified;
      const result = await membersStore.certifyUser(Number(userId), newStatus);
      if (result.success) {
        if (user.value) user.value.certified = newStatus;
        if (member.value) member.value.certified = newStatus;
        toast.success(newStatus ? "Utilisateur certifi\xE9" : "Certification retir\xE9e");
      } else {
        toast.error("Erreur lors de la modification du statut");
      }
      isUpdating.value = null;
    };
    const openImage = (url) => {
      if (url && url !== "string" && url !== "") {
        const index = lightboxImgs.value.indexOf(url);
        if (index !== -1) {
          imgIndex.value = index;
          isVisible.value = true;
        } else {
          imgIndex.value = 0;
          isVisible.value = true;
        }
      }
    };
    const printPage = () => {
      (void 0).print();
    };
    const downloadPDF = async () => {
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto space-y-6 pb-20" }, _attrs))} data-v-f2953320><div class="flex items-center justify-between" data-v-f2953320>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "ghost",
        onClick: ($event) => unref(router).back(),
        class: "gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Retour aux utilisateurs `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4" }),
              createTextVNode(" Retour aux utilisateurs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (user.value) {
        _push(`<div class="flex gap-2" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          onClick: printPage,
          class: "gap-2 h-10 no-print"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Imprimer `);
            } else {
              return [
                createVNode(unref(Printer), { class: "h-4 w-4" }),
                createTextVNode(" Imprimer ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          onClick: downloadPDF,
          class: "gap-2 h-10 no-print"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(FileDown), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` PDF `);
            } else {
              return [
                createVNode(unref(FileDown), { class: "h-4 w-4" }),
                createTextVNode(" PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          disabled: !!isUpdating.value,
          onClick: toggleCertification,
          class: `${user.value.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-10 px-6 font-bold transition-all no-print`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isUpdating.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin mr-2" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!--[-->`);
                if (!user.value.certified) {
                  _push2(ssrRenderComponent(unref(UserCheck), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(UserMinus), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(user.value.certified ? "Retirer la certification" : "Certifier le profil")}<!--]-->`);
              }
            } else {
              return [
                isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "h-4 w-4 animate-spin mr-2"
                })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  !user.value.certified ? (openBlock(), createBlock(unref(UserCheck), {
                    key: 0,
                    class: "h-4 w-4 mr-2"
                  })) : (openBlock(), createBlock(unref(UserMinus), {
                    key: 1,
                    class: "h-4 w-4 mr-2"
                  })),
                  createTextVNode(" " + toDisplayString(user.value.certified ? "Retirer la certification" : "Certifier le profil"), 1)
                ], 64))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (isLoading.value) {
        _push(`<div class="space-y-6" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), { class: "h-32 w-full rounded-2xl" }, null, _parent));
        _push(`<div class="grid md:grid-cols-3 gap-6" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), { class: "h-64 rounded-2xl" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), { class: "h-64 md:col-span-2 rounded-2xl" }, null, _parent));
        _push(`</div></div>`);
      } else if (user.value) {
        _push(`<div id="user-profile-content" class="space-y-6 bg-background" data-v-f2953320><div class="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden" data-v-f2953320><div class="absolute top-0 right-0 p-8 opacity-5" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-32 w-32" }, null, _parent));
        _push(`</div><div class="flex flex-col md:flex-row items-center gap-6 relative z-10" data-v-f2953320><div class="relative group cursor-zoom-in" data-v-f2953320><div class="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-3xl text-primary border-2 border-primary/20 overflow-hidden group-hover:ring-4 ring-primary/20 transition-all" data-v-f2953320>`);
        if ((_a = member.value) == null ? void 0 : _a.images) {
          _push(`<img${ssrRenderAttr("src", member.value.images)} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" data-v-f2953320>`);
        } else {
          _push(`<span data-v-f2953320>${ssrInterpolate((_b = user.value.username) == null ? void 0 : _b.charAt(0).toUpperCase())}</span>`);
        }
        _push(`</div><div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(Maximize2), { class: "h-5 w-5" }, null, _parent));
        _push(`</div>`);
        if (user.value.certified) {
          _push(`<div class="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-card shadow-lg z-20" data-v-f2953320>`);
          _push(ssrRenderComponent(unref(UserCheck), { class: "h-4 w-4" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-center md:text-left space-y-1" data-v-f2953320><div class="flex items-center justify-center md:justify-start gap-2" data-v-f2953320><h1 class="text-3xl font-black tracking-tight text-foreground" data-v-f2953320>${ssrInterpolate(((_c = member.value) == null ? void 0 : _c.fullName) || user.value.username)}</h1>`);
        if (user.value.premium) {
          _push(ssrRenderComponent(unref(_sfc_main$3), { class: "bg-amber-500" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Premium`);
              } else {
                return [
                  createTextVNode("Premium")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-wrap items-center justify-center md:justify-start gap-3" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "outline",
          class: "font-mono text-xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`ID UTILISATEUR: #${ssrInterpolate(user.value.userId)}`);
            } else {
              return [
                createTextVNode("ID UTILISATEUR: #" + toDisplayString(user.value.userId), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-1.5 text-muted-foreground text-sm" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 text-primary/60" }, null, _parent));
        _push(` ${ssrInterpolate(user.value.city)}, ${ssrInterpolate(user.value.country)}</div></div></div></div></div><div class="grid md:grid-cols-3 gap-6" data-v-f2953320><div class="space-y-6" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-2xl border-none shadow-sm bg-muted/30" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "pb-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm font-bold uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Donn\xE9es Personnelles`);
                        } else {
                          return [
                            createTextVNode("Donn\xE9es Personnelles")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$4), { class: "text-sm font-bold uppercase tracking-widest text-muted-foreground" }, {
                        default: withCtx(() => [
                          createTextVNode("Donn\xE9es Personnelles")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "space-y-4" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j;
                  if (_push3) {
                    _push3(`<div class="grid grid-cols-2 gap-4 pb-2 border-b border-muted/50" data-v-f2953320${_scopeId2}><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70" data-v-f2953320${_scopeId2}>Pr\xE9nom</label><p class="font-bold text-sm" data-v-f2953320${_scopeId2}>${ssrInterpolate(((_a2 = member.value) == null ? void 0 : _a2.firstName) || user.value.username || "\u2014")}</p></div><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70" data-v-f2953320${_scopeId2}>Nom</label><p class="font-bold text-sm" data-v-f2953320${_scopeId2}>${ssrInterpolate(((_b2 = member.value) == null ? void 0 : _b2.lastName) || "\u2014")}</p></div></div><div class="space-y-3" data-v-f2953320${_scopeId2}><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" data-v-f2953320${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Mail), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                    _push3(` Email </label><p class="font-bold text-sm break-all" data-v-f2953320${_scopeId2}>${ssrInterpolate(user.value.email || "Non renseign\xE9")}</p></div><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" data-v-f2953320${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Phone), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                    _push3(` T\xE9l\xE9phone </label><p class="font-bold text-sm" data-v-f2953320${_scopeId2}>${ssrInterpolate(user.value.phone || "Non renseign\xE9")}</p></div></div><div class="pt-2 border-t border-muted/50 space-y-3" data-v-f2953320${_scopeId2}><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70" data-v-f2953320${_scopeId2}>Type de Pi\xE8ce</label>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "secondary",
                      class: "font-bold text-[10px] block w-fit mt-1"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a3 = member.value) == null ? void 0 : _a3.typeCardId) ? unref(membersStore).getCardTypeName(member.value.typeCardId) : "Non sp\xE9cifi\xE9")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b3 = member.value) == null ? void 0 : _b3.typeCardId) ? unref(membersStore).getCardTypeName(member.value.typeCardId) : "Non sp\xE9cifi\xE9"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div data-v-f2953320${_scopeId2}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70" data-v-f2953320${_scopeId2}>Num\xE9ro de Carte</label><div class="flex items-center gap-2 font-mono bg-background px-2 py-1.5 rounded border text-[11px] mt-1" data-v-f2953320${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(CreditCard), { class: "h-3 w-3 text-muted-foreground" }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(((_c2 = member.value) == null ? void 0 : _c2.numberCard) && ((_d = member.value) == null ? void 0 : _d.numberCard) !== "string" ? member.value.numberCard : "Non sp\xE9cifi\xE9")}</div></div></div><div class="pt-2 border-t border-muted/50" data-v-f2953320${_scopeId2}><div class="flex items-start gap-2" data-v-f2953320${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 text-primary shrink-0 mt-0.5" }, null, _parent3, _scopeId2));
                    _push3(`<div class="text-[11px] leading-tight" data-v-f2953320${_scopeId2}><p class="font-bold" data-v-f2953320${_scopeId2}>${ssrInterpolate(user.value.city || "\u2014")}, ${ssrInterpolate(user.value.country || "\u2014")}</p><p class="text-muted-foreground mt-1 text-[10px]" data-v-f2953320${_scopeId2}>${ssrInterpolate(((_e = member.value) == null ? void 0 : _e.address) || "Adresse physique non renseign\xE9e")}</p></div></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid grid-cols-2 gap-4 pb-2 border-b border-muted/50" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Pr\xE9nom"),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(((_f = member.value) == null ? void 0 : _f.firstName) || user.value.username || "\u2014"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Nom"),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(((_g = member.value) == null ? void 0 : _g.lastName) || "\u2014"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" }, [
                            createVNode(unref(Mail), { class: "h-3 w-3" }),
                            createTextVNode(" Email ")
                          ]),
                          createVNode("p", { class: "font-bold text-sm break-all" }, toDisplayString(user.value.email || "Non renseign\xE9"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" }, [
                            createVNode(unref(Phone), { class: "h-3 w-3" }),
                            createTextVNode(" T\xE9l\xE9phone ")
                          ]),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(user.value.phone || "Non renseign\xE9"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "pt-2 border-t border-muted/50 space-y-3" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Type de Pi\xE8ce"),
                          createVNode(unref(_sfc_main$3), {
                            variant: "secondary",
                            class: "font-bold text-[10px] block w-fit mt-1"
                          }, {
                            default: withCtx(() => {
                              var _a3;
                              return [
                                createTextVNode(toDisplayString(((_a3 = member.value) == null ? void 0 : _a3.typeCardId) ? unref(membersStore).getCardTypeName(member.value.typeCardId) : "Non sp\xE9cifi\xE9"), 1)
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Num\xE9ro de Carte"),
                          createVNode("div", { class: "flex items-center gap-2 font-mono bg-background px-2 py-1.5 rounded border text-[11px] mt-1" }, [
                            createVNode(unref(CreditCard), { class: "h-3 w-3 text-muted-foreground" }),
                            createTextVNode(" " + toDisplayString(((_h = member.value) == null ? void 0 : _h.numberCard) && ((_i = member.value) == null ? void 0 : _i.numberCard) !== "string" ? member.value.numberCard : "Non sp\xE9cifi\xE9"), 1)
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "pt-2 border-t border-muted/50" }, [
                        createVNode("div", { class: "flex items-start gap-2" }, [
                          createVNode(unref(MapPin), { class: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
                          createVNode("div", { class: "text-[11px] leading-tight" }, [
                            createVNode("p", { class: "font-bold" }, toDisplayString(user.value.city || "\u2014") + ", " + toDisplayString(user.value.country || "\u2014"), 1),
                            createVNode("p", { class: "text-muted-foreground mt-1 text-[10px]" }, toDisplayString(((_j = member.value) == null ? void 0 : _j.address) || "Adresse physique non renseign\xE9e"), 1)
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1$2), { class: "pb-2" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$4), { class: "text-sm font-bold uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx(() => [
                        createTextVNode("Donn\xE9es Personnelles")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$5), { class: "space-y-4" }, {
                  default: withCtx(() => {
                    var _a2, _b2, _c2, _d, _e;
                    return [
                      createVNode("div", { class: "grid grid-cols-2 gap-4 pb-2 border-b border-muted/50" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Pr\xE9nom"),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(((_a2 = member.value) == null ? void 0 : _a2.firstName) || user.value.username || "\u2014"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Nom"),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(((_b2 = member.value) == null ? void 0 : _b2.lastName) || "\u2014"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" }, [
                            createVNode(unref(Mail), { class: "h-3 w-3" }),
                            createTextVNode(" Email ")
                          ]),
                          createVNode("p", { class: "font-bold text-sm break-all" }, toDisplayString(user.value.email || "Non renseign\xE9"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase opacity-70" }, [
                            createVNode(unref(Phone), { class: "h-3 w-3" }),
                            createTextVNode(" T\xE9l\xE9phone ")
                          ]),
                          createVNode("p", { class: "font-bold text-sm" }, toDisplayString(user.value.phone || "Non renseign\xE9"), 1)
                        ])
                      ]),
                      createVNode("div", { class: "pt-2 border-t border-muted/50 space-y-3" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Type de Pi\xE8ce"),
                          createVNode(unref(_sfc_main$3), {
                            variant: "secondary",
                            class: "font-bold text-[10px] block w-fit mt-1"
                          }, {
                            default: withCtx(() => {
                              var _a3;
                              return [
                                createTextVNode(toDisplayString(((_a3 = member.value) == null ? void 0 : _a3.typeCardId) ? unref(membersStore).getCardTypeName(member.value.typeCardId) : "Non sp\xE9cifi\xE9"), 1)
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-[10px] font-bold text-muted-foreground uppercase opacity-70" }, "Num\xE9ro de Carte"),
                          createVNode("div", { class: "flex items-center gap-2 font-mono bg-background px-2 py-1.5 rounded border text-[11px] mt-1" }, [
                            createVNode(unref(CreditCard), { class: "h-3 w-3 text-muted-foreground" }),
                            createTextVNode(" " + toDisplayString(((_c2 = member.value) == null ? void 0 : _c2.numberCard) && ((_d = member.value) == null ? void 0 : _d.numberCard) !== "string" ? member.value.numberCard : "Non sp\xE9cifi\xE9"), 1)
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "pt-2 border-t border-muted/50" }, [
                        createVNode("div", { class: "flex items-start gap-2" }, [
                          createVNode(unref(MapPin), { class: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
                          createVNode("div", { class: "text-[11px] leading-tight" }, [
                            createVNode("p", { class: "font-bold" }, toDisplayString(user.value.city || "\u2014") + ", " + toDisplayString(user.value.country || "\u2014"), 1),
                            createVNode("p", { class: "text-muted-foreground mt-1 text-[10px]" }, toDisplayString(((_e = member.value) == null ? void 0 : _e.address) || "Adresse physique non renseign\xE9e"), 1)
                          ])
                        ])
                      ])
                    ];
                  }),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!user.value.certified) {
          _push(`<div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800 text-sm space-y-2" data-v-f2953320><div class="flex items-center gap-2 font-bold" data-v-f2953320>`);
          _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-4 w-4" }, null, _parent));
          _push(` V\xE9rification requise </div>`);
          if (member.value) {
            _push(`<p data-v-f2953320>Veuillez v\xE9rifier les documents d&#39;identit\xE9 ci-contre avant de certifier ce profil.</p>`);
          } else {
            _push(`<p data-v-f2953320>Cet utilisateur n&#39;a pas encore soumis ses documents d&#39;identit\xE9 pour certification.</p>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2 space-y-6" data-v-f2953320>`);
        if (member.value) {
          _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-2xl shadow-sm overflow-hidden border-none bg-card" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "bg-muted/50 border-b" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "flex items-center gap-2" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(CreditCard), { class: "h-5 w-5 text-primary" }, null, _parent4, _scopeId3));
                            _push4(` Pi\xE8ces d&#39;identit\xE9 soumises `);
                          } else {
                            return [
                              createVNode(unref(CreditCard), { class: "h-5 w-5 text-primary" }),
                              createTextVNode(" Pi\xE8ces d'identit\xE9 soumises ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$4), { class: "flex items-center gap-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(CreditCard), { class: "h-5 w-5 text-primary" }),
                            createTextVNode(" Pi\xE8ces d'identit\xE9 soumises ")
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "p-6" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="grid sm:grid-cols-2 gap-6" data-v-f2953320${_scopeId2}><div class="space-y-3" data-v-f2953320${_scopeId2}><label class="text-sm font-bold flex items-center gap-2" data-v-f2953320${_scopeId2}><div class="h-2 w-2 rounded-full bg-blue-500" data-v-f2953320${_scopeId2}></div> Recto de la carte </label><div class="aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in" data-v-f2953320${_scopeId2}>`);
                      if (member.value.cardFront && member.value.cardFront !== "string" && member.value.cardFront !== "") {
                        _push3(`<img${ssrRenderAttr("src", member.value.cardFront)} class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" data-v-f2953320${_scopeId2}>`);
                      } else {
                        _push3(`<div class="flex flex-col items-center gap-2 text-muted-foreground/50" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(Image), { class: "h-10 w-10" }, null, _parent3, _scopeId2));
                        _push3(`<span class="text-xs" data-v-f2953320${_scopeId2}>Document manquant</span></div>`);
                      }
                      if (member.value.cardFront) {
                        _push3(`<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(Maximize2), { class: "h-5 w-5" }, null, _parent3, _scopeId2));
                        _push3(` Agrandir </div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div></div><div class="space-y-3" data-v-f2953320${_scopeId2}><label class="text-sm font-bold flex items-center gap-2" data-v-f2953320${_scopeId2}><div class="h-2 w-2 rounded-full bg-blue-500" data-v-f2953320${_scopeId2}></div> Verso de la carte </label><div class="aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in" data-v-f2953320${_scopeId2}>`);
                      if (member.value.cardBack && member.value.cardBack !== "string" && member.value.cardBack !== "") {
                        _push3(`<img${ssrRenderAttr("src", member.value.cardBack)} class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" data-v-f2953320${_scopeId2}>`);
                      } else {
                        _push3(`<div class="flex flex-col items-center gap-2 text-muted-foreground/50" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(Image), { class: "h-10 w-10" }, null, _parent3, _scopeId2));
                        _push3(`<span class="text-xs" data-v-f2953320${_scopeId2}>Document manquant</span></div>`);
                      }
                      if (member.value.cardBack) {
                        _push3(`<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(Maximize2), { class: "h-5 w-5" }, null, _parent3, _scopeId2));
                        _push3(` Agrandir </div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div></div></div><div class="mt-8 p-4 bg-muted/30 rounded-xl border border-muted flex items-start gap-4" data-v-f2953320${_scopeId2}><div class="h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0" data-v-f2953320${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(ShieldAlert), { class: "h-5 w-5 text-amber-500" }, null, _parent3, _scopeId2));
                      _push3(`</div><div class="text-sm space-y-1" data-v-f2953320${_scopeId2}><p class="font-bold" data-v-f2953320${_scopeId2}>Instructions de mod\xE9ration</p><p class="text-muted-foreground leading-relaxed" data-v-f2953320${_scopeId2}>Assurez-vous que le nom complet (${ssrInterpolate(member.value.fullName)}) correspond exactement aux documents fournis. V\xE9rifiez \xE9galement que les photos sont claires et non retouch\xE9es.</p></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "grid sm:grid-cols-2 gap-6" }, [
                          createVNode("div", { class: "space-y-3" }, [
                            createVNode("label", { class: "text-sm font-bold flex items-center gap-2" }, [
                              createVNode("div", { class: "h-2 w-2 rounded-full bg-blue-500" }),
                              createTextVNode(" Recto de la carte ")
                            ]),
                            createVNode("div", {
                              class: "aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in",
                              onClick: ($event) => openImage(member.value.cardFront)
                            }, [
                              member.value.cardFront && member.value.cardFront !== "string" && member.value.cardFront !== "" ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: member.value.cardFront,
                                class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "flex flex-col items-center gap-2 text-muted-foreground/50"
                              }, [
                                createVNode(unref(Image), { class: "h-10 w-10" }),
                                createVNode("span", { class: "text-xs" }, "Document manquant")
                              ])),
                              member.value.cardFront ? (openBlock(), createBlock("div", {
                                key: 2,
                                class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
                              }, [
                                createVNode(unref(Maximize2), { class: "h-5 w-5" }),
                                createTextVNode(" Agrandir ")
                              ])) : createCommentVNode("", true)
                            ], 8, ["onClick"])
                          ]),
                          createVNode("div", { class: "space-y-3" }, [
                            createVNode("label", { class: "text-sm font-bold flex items-center gap-2" }, [
                              createVNode("div", { class: "h-2 w-2 rounded-full bg-blue-500" }),
                              createTextVNode(" Verso de la carte ")
                            ]),
                            createVNode("div", {
                              class: "aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in",
                              onClick: ($event) => openImage(member.value.cardBack)
                            }, [
                              member.value.cardBack && member.value.cardBack !== "string" && member.value.cardBack !== "" ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: member.value.cardBack,
                                class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "flex flex-col items-center gap-2 text-muted-foreground/50"
                              }, [
                                createVNode(unref(Image), { class: "h-10 w-10" }),
                                createVNode("span", { class: "text-xs" }, "Document manquant")
                              ])),
                              member.value.cardBack ? (openBlock(), createBlock("div", {
                                key: 2,
                                class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
                              }, [
                                createVNode(unref(Maximize2), { class: "h-5 w-5" }),
                                createTextVNode(" Agrandir ")
                              ])) : createCommentVNode("", true)
                            ], 8, ["onClick"])
                          ])
                        ]),
                        createVNode("div", { class: "mt-8 p-4 bg-muted/30 rounded-xl border border-muted flex items-start gap-4" }, [
                          createVNode("div", { class: "h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0" }, [
                            createVNode(unref(ShieldAlert), { class: "h-5 w-5 text-amber-500" })
                          ]),
                          createVNode("div", { class: "text-sm space-y-1" }, [
                            createVNode("p", { class: "font-bold" }, "Instructions de mod\xE9ration"),
                            createVNode("p", { class: "text-muted-foreground leading-relaxed" }, "Assurez-vous que le nom complet (" + toDisplayString(member.value.fullName) + ") correspond exactement aux documents fournis. V\xE9rifiez \xE9galement que les photos sont claires et non retouch\xE9es.", 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$1$2), { class: "bg-muted/50 border-b" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$4), { class: "flex items-center gap-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(CreditCard), { class: "h-5 w-5 text-primary" }),
                          createTextVNode(" Pi\xE8ces d'identit\xE9 soumises ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$5), { class: "p-6" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "grid sm:grid-cols-2 gap-6" }, [
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("label", { class: "text-sm font-bold flex items-center gap-2" }, [
                            createVNode("div", { class: "h-2 w-2 rounded-full bg-blue-500" }),
                            createTextVNode(" Recto de la carte ")
                          ]),
                          createVNode("div", {
                            class: "aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in",
                            onClick: ($event) => openImage(member.value.cardFront)
                          }, [
                            member.value.cardFront && member.value.cardFront !== "string" && member.value.cardFront !== "" ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: member.value.cardFront,
                              class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex flex-col items-center gap-2 text-muted-foreground/50"
                            }, [
                              createVNode(unref(Image), { class: "h-10 w-10" }),
                              createVNode("span", { class: "text-xs" }, "Document manquant")
                            ])),
                            member.value.cardFront ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
                            }, [
                              createVNode(unref(Maximize2), { class: "h-5 w-5" }),
                              createTextVNode(" Agrandir ")
                            ])) : createCommentVNode("", true)
                          ], 8, ["onClick"])
                        ]),
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("label", { class: "text-sm font-bold flex items-center gap-2" }, [
                            createVNode("div", { class: "h-2 w-2 rounded-full bg-blue-500" }),
                            createTextVNode(" Verso de la carte ")
                          ]),
                          createVNode("div", {
                            class: "aspect-[1.6/1] bg-muted rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in",
                            onClick: ($event) => openImage(member.value.cardBack)
                          }, [
                            member.value.cardBack && member.value.cardBack !== "string" && member.value.cardBack !== "" ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: member.value.cardBack,
                              class: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex flex-col items-center gap-2 text-muted-foreground/50"
                            }, [
                              createVNode(unref(Image), { class: "h-10 w-10" }),
                              createVNode("span", { class: "text-xs" }, "Document manquant")
                            ])),
                            member.value.cardBack ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
                            }, [
                              createVNode(unref(Maximize2), { class: "h-5 w-5" }),
                              createTextVNode(" Agrandir ")
                            ])) : createCommentVNode("", true)
                          ], 8, ["onClick"])
                        ])
                      ]),
                      createVNode("div", { class: "mt-8 p-4 bg-muted/30 rounded-xl border border-muted flex items-start gap-4" }, [
                        createVNode("div", { class: "h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0" }, [
                          createVNode(unref(ShieldAlert), { class: "h-5 w-5 text-amber-500" })
                        ]),
                        createVNode("div", { class: "text-sm space-y-1" }, [
                          createVNode("p", { class: "font-bold" }, "Instructions de mod\xE9ration"),
                          createVNode("p", { class: "text-muted-foreground leading-relaxed" }, "Assurez-vous que le nom complet (" + toDisplayString(member.value.fullName) + ") correspond exactement aux documents fournis. V\xE9rifiez \xE9galement que les photos sont claires et non retouch\xE9es.", 1)
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-2xl shadow-sm border-none bg-muted/20 h-full min-h-[400px] flex items-center justify-center" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="text-center space-y-4 max-w-md p-6" data-v-f2953320${_scopeId}><div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto" data-v-f2953320${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Image), { class: "h-10 w-10 text-muted-foreground/40" }, null, _parent2, _scopeId));
                _push2(`</div><div class="space-y-1" data-v-f2953320${_scopeId}><h3 class="text-lg font-bold" data-v-f2953320${_scopeId}>Aucun document soumis</h3><p class="text-sm text-muted-foreground" data-v-f2953320${_scopeId}>Cet utilisateur n&#39;a pas encore rempli son formulaire de certification. Ses documents d&#39;identit\xE9 appara\xEEtront ici une fois soumis.</p></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "text-center space-y-4 max-w-md p-6" }, [
                    createVNode("div", { class: "h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto" }, [
                      createVNode(unref(Image), { class: "h-10 w-10 text-muted-foreground/40" })
                    ]),
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("h3", { class: "text-lg font-bold" }, "Aucun document soumis"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "Cet utilisateur n'a pas encore rempli son formulaire de certification. Ses documents d'identit\xE9 appara\xEEtront ici une fois soumis.")
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div><div class="space-y-8 pt-6 border-t" data-v-f2953320><div class="flex items-center gap-3" data-v-f2953320><div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(Tag), { class: "h-5 w-5" }, null, _parent));
        _push(`</div><h2 class="text-2xl font-black tracking-tight" data-v-f2953320>Publications de l&#39;utilisateur</h2></div><div class="space-y-4" data-v-f2953320><div class="flex items-center justify-between" data-v-f2953320><h3 class="text-lg font-bold flex items-center gap-2" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(Home), { class: "h-5 w-5 text-blue-500" }, null, _parent));
        _push(` Propri\xE9t\xE9s Immobili\xE8res `);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "secondary",
          class: "rounded-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(userProperties.value.length)}`);
            } else {
              return [
                createTextVNode(toDisplayString(userProperties.value.length), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h3></div>`);
        if (userProperties.value.length > 0) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-f2953320><!--[-->`);
          ssrRenderList(userProperties.value, (item) => {
            _push(ssrRenderComponent(unref(_sfc_main$1$1), {
              key: item.id,
              class: "group overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all rounded-2xl cursor-pointer",
              onClick: ($event) => unref(router).push(`/dashboard/publications/properties/${item.id}`)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="aspect-video relative overflow-hidden bg-muted" data-v-f2953320${_scopeId}>`);
                  if (item.image) {
                    _push2(`<img${ssrRenderAttr("src", item.image)} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" data-v-f2953320${_scopeId}>`);
                  } else {
                    _push2(`<div class="h-full w-full flex items-center justify-center text-muted-foreground/30" data-v-f2953320${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Image), { class: "h-10 w-10" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  _push2(`<div class="absolute top-3 left-3" data-v-f2953320${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "bg-black/60 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-widest" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(item.type)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(item.type), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "p-4 space-y-3" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<h4 class="font-bold text-base truncate" data-v-f2953320${_scopeId2}>${ssrInterpolate(item.title)}</h4><div class="flex items-center gap-1.5 text-xs text-muted-foreground" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5" }, null, _parent3, _scopeId2));
                        _push3(`<span class="truncate" data-v-f2953320${_scopeId2}>${ssrInterpolate(item.address || "Adresse non sp\xE9cifi\xE9e")}</span></div><div class="flex items-baseline justify-between pt-2 border-t border-muted" data-v-f2953320${_scopeId2}><span class="text-sm font-black text-primary italic" data-v-f2953320${_scopeId2}>${ssrInterpolate(item.price)} ${ssrInterpolate(item.currency)}</span>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$3), {
                          variant: "outline",
                          class: "text-[10px]"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(item.transactionType)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.transactionType), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("h4", { class: "font-bold text-base truncate" }, toDisplayString(item.title), 1),
                          createVNode("div", { class: "flex items-center gap-1.5 text-xs text-muted-foreground" }, [
                            createVNode(unref(MapPin), { class: "h-3.5 w-3.5" }),
                            createVNode("span", { class: "truncate" }, toDisplayString(item.address || "Adresse non sp\xE9cifi\xE9e"), 1)
                          ]),
                          createVNode("div", { class: "flex items-baseline justify-between pt-2 border-t border-muted" }, [
                            createVNode("span", { class: "text-sm font-black text-primary italic" }, toDisplayString(item.price) + " " + toDisplayString(item.currency), 1),
                            createVNode(unref(_sfc_main$3), {
                              variant: "outline",
                              class: "text-[10px]"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.transactionType), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "aspect-video relative overflow-hidden bg-muted" }, [
                      item.image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: item.image,
                        class: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "h-full w-full flex items-center justify-center text-muted-foreground/30"
                      }, [
                        createVNode(unref(Image), { class: "h-10 w-10" })
                      ])),
                      createVNode("div", { class: "absolute top-3 left-3" }, [
                        createVNode(unref(_sfc_main$3), { class: "bg-black/60 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-widest" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.type), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ])
                    ]),
                    createVNode(unref(_sfc_main$5), { class: "p-4 space-y-3" }, {
                      default: withCtx(() => [
                        createVNode("h4", { class: "font-bold text-base truncate" }, toDisplayString(item.title), 1),
                        createVNode("div", { class: "flex items-center gap-1.5 text-xs text-muted-foreground" }, [
                          createVNode(unref(MapPin), { class: "h-3.5 w-3.5" }),
                          createVNode("span", { class: "truncate" }, toDisplayString(item.address || "Adresse non sp\xE9cifi\xE9e"), 1)
                        ]),
                        createVNode("div", { class: "flex items-baseline justify-between pt-2 border-t border-muted" }, [
                          createVNode("span", { class: "text-sm font-black text-primary italic" }, toDisplayString(item.price) + " " + toDisplayString(item.currency), 1),
                          createVNode(unref(_sfc_main$3), {
                            variant: "outline",
                            class: "text-[10px]"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.transactionType), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3 bg-muted/20" data-v-f2953320><div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center" data-v-f2953320>`);
          _push(ssrRenderComponent(unref(Home), { class: "h-6 w-6 text-muted-foreground/40" }, null, _parent));
          _push(`</div><p class="text-sm text-muted-foreground font-medium" data-v-f2953320>Aucune propri\xE9t\xE9 publi\xE9e par cet utilisateur.</p></div>`);
        }
        _push(`</div><div class="space-y-4" data-v-f2953320><div class="flex items-center justify-between" data-v-f2953320><h3 class="text-lg font-bold flex items-center gap-2" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(Briefcase), { class: "h-5 w-5 text-amber-500" }, null, _parent));
        _push(` Prestations de Service `);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "secondary",
          class: "rounded-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(userServices.value.length)}`);
            } else {
              return [
                createTextVNode(toDisplayString(userServices.value.length), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h3></div>`);
        if (userServices.value.length > 0) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-f2953320><!--[-->`);
          ssrRenderList(userServices.value, (s) => {
            var _a2;
            _push(ssrRenderComponent(unref(_sfc_main$1$1), {
              key: (_a2 = s.prestation) == null ? void 0 : _a2.id,
              class: "group overflow-hidden border-none shadow-sm bg-card hover:shadow-md transition-all rounded-2xl cursor-pointer",
              onClick: ($event) => {
                var _a3;
                return unref(router).push(`/dashboard/publications/services/${(_a3 = s.prestation) == null ? void 0 : _a3.id}`);
              }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a3, _b2, _c2, _d;
                if (_push2) {
                  _push2(`<div class="aspect-video relative overflow-hidden bg-muted" data-v-f2953320${_scopeId}>`);
                  if ((_b2 = (_a3 = s.image) == null ? void 0 : _a3[0]) == null ? void 0 : _b2.path) {
                    _push2(`<img${ssrRenderAttr("src", s.image[0].path)} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" data-v-f2953320${_scopeId}>`);
                  } else {
                    _push2(`<div class="h-full w-full flex items-center justify-center text-muted-foreground/30" data-v-f2953320${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Briefcase), { class: "h-10 w-10" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  _push2(`<div class="absolute top-3 left-3" data-v-f2953320${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "bg-amber-500 text-white border-none text-[10px] font-bold uppercase tracking-widest" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Service`);
                      } else {
                        return [
                          createTextVNode("Service")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "p-4 space-y-3" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      var _a4, _b3, _c3, _d2, _e, _f, _g, _h;
                      if (_push3) {
                        _push3(`<h4 class="font-bold text-base truncate" data-v-f2953320${_scopeId2}>${ssrInterpolate((_a4 = s.prestation) == null ? void 0 : _a4.title)}</h4><div class="flex items-center gap-3 text-xs text-muted-foreground" data-v-f2953320${_scopeId2}><div class="flex items-center gap-1" data-v-f2953320${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(Clock), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                        _push3(` ${ssrInterpolate((_b3 = s.prestation) == null ? void 0 : _b3.experience)}</div>`);
                        if ((_c3 = s.prestation) == null ? void 0 : _c3.certified) {
                          _push3(`<div class="flex items-center gap-1 text-green-600 font-bold" data-v-f2953320${_scopeId2}>`);
                          _push3(ssrRenderComponent(unref(CheckCircle2), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                          _push3(` V\xE9rifi\xE9 </div>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div><div class="flex items-center justify-between pt-2 border-t border-muted" data-v-f2953320${_scopeId2}><div class="flex flex-col" data-v-f2953320${_scopeId2}><span class="text-[10px] text-muted-foreground uppercase font-bold" data-v-f2953320${_scopeId2}>\xC0 partir de</span><span class="text-sm font-black text-primary italic" data-v-f2953320${_scopeId2}>${ssrInterpolate((_d2 = s.prestation) == null ? void 0 : _d2.minPrice)} $</span></div>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$3), {
                          variant: "outline",
                          class: "text-[10px] px-2"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`D\xE9tails`);
                            } else {
                              return [
                                createTextVNode("D\xE9tails")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("h4", { class: "font-bold text-base truncate" }, toDisplayString((_e = s.prestation) == null ? void 0 : _e.title), 1),
                          createVNode("div", { class: "flex items-center gap-3 text-xs text-muted-foreground" }, [
                            createVNode("div", { class: "flex items-center gap-1" }, [
                              createVNode(unref(Clock), { class: "h-3 w-3" }),
                              createTextVNode(" " + toDisplayString((_f = s.prestation) == null ? void 0 : _f.experience), 1)
                            ]),
                            ((_g = s.prestation) == null ? void 0 : _g.certified) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-center gap-1 text-green-600 font-bold"
                            }, [
                              createVNode(unref(CheckCircle2), { class: "h-3 w-3" }),
                              createTextVNode(" V\xE9rifi\xE9 ")
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center justify-between pt-2 border-t border-muted" }, [
                            createVNode("div", { class: "flex flex-col" }, [
                              createVNode("span", { class: "text-[10px] text-muted-foreground uppercase font-bold" }, "\xC0 partir de"),
                              createVNode("span", { class: "text-sm font-black text-primary italic" }, toDisplayString((_h = s.prestation) == null ? void 0 : _h.minPrice) + " $", 1)
                            ]),
                            createVNode(unref(_sfc_main$3), {
                              variant: "outline",
                              class: "text-[10px] px-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("D\xE9tails")
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "aspect-video relative overflow-hidden bg-muted" }, [
                      ((_d = (_c2 = s.image) == null ? void 0 : _c2[0]) == null ? void 0 : _d.path) ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: s.image[0].path,
                        class: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "h-full w-full flex items-center justify-center text-muted-foreground/30"
                      }, [
                        createVNode(unref(Briefcase), { class: "h-10 w-10" })
                      ])),
                      createVNode("div", { class: "absolute top-3 left-3" }, [
                        createVNode(unref(_sfc_main$3), { class: "bg-amber-500 text-white border-none text-[10px] font-bold uppercase tracking-widest" }, {
                          default: withCtx(() => [
                            createTextVNode("Service")
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    createVNode(unref(_sfc_main$5), { class: "p-4 space-y-3" }, {
                      default: withCtx(() => {
                        var _a4, _b3, _c3, _d2;
                        return [
                          createVNode("h4", { class: "font-bold text-base truncate" }, toDisplayString((_a4 = s.prestation) == null ? void 0 : _a4.title), 1),
                          createVNode("div", { class: "flex items-center gap-3 text-xs text-muted-foreground" }, [
                            createVNode("div", { class: "flex items-center gap-1" }, [
                              createVNode(unref(Clock), { class: "h-3 w-3" }),
                              createTextVNode(" " + toDisplayString((_b3 = s.prestation) == null ? void 0 : _b3.experience), 1)
                            ]),
                            ((_c3 = s.prestation) == null ? void 0 : _c3.certified) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-center gap-1 text-green-600 font-bold"
                            }, [
                              createVNode(unref(CheckCircle2), { class: "h-3 w-3" }),
                              createTextVNode(" V\xE9rifi\xE9 ")
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center justify-between pt-2 border-t border-muted" }, [
                            createVNode("div", { class: "flex flex-col" }, [
                              createVNode("span", { class: "text-[10px] text-muted-foreground uppercase font-bold" }, "\xC0 partir de"),
                              createVNode("span", { class: "text-sm font-black text-primary italic" }, toDisplayString((_d2 = s.prestation) == null ? void 0 : _d2.minPrice) + " $", 1)
                            ]),
                            createVNode(unref(_sfc_main$3), {
                              variant: "outline",
                              class: "text-[10px] px-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("D\xE9tails")
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3 bg-muted/20" data-v-f2953320><div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center" data-v-f2953320>`);
          _push(ssrRenderComponent(unref(Briefcase), { class: "h-6 w-6 text-muted-foreground/40" }, null, _parent));
          _push(`</div><p class="text-sm text-muted-foreground font-medium" data-v-f2953320>Aucun service publi\xE9 par cet utilisateur.</p></div>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="h-96 flex flex-col items-center justify-center gap-4 text-center" data-v-f2953320><div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center" data-v-f2953320>`);
        _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
        _push(`</div><div class="space-y-1" data-v-f2953320><h2 class="text-2xl font-black" data-v-f2953320>Utilisateur introuvable</h2><p class="text-muted-foreground" data-v-f2953320>Cet utilisateur n&#39;a peut-\xEAtre pas encore soumis de donn\xE9es de certification.</p></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: ($event) => unref(router).back()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour \xE0 la liste`);
            } else {
              return [
                createTextVNode("Retour \xE0 la liste")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(unref(VueEasyLightbox), {
        visible: isVisible.value,
        imgs: lightboxImgs.value,
        index: imgIndex.value,
        onHide: ($event) => isVisible.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/users/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f2953320"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BK0yZV3-.mjs.map
