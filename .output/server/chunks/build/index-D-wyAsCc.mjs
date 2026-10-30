import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { ShieldCheck, CreditCard, CheckCircle2, Sparkles, LayoutDashboard, Info, User, Camera, MapPin, Phone, X, Upload, Loader2, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$4 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$6 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$5 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$1, a as _sfc_main$3 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$2 } from './CardTitle-CY-VC8BI.mjs';
import { _ as _export_sfc, l as useAuthStore, j as joinApi, A as ApiEndpoints, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const config = useRuntimeConfig();
    const isLoading = ref(false);
    ref(false);
    const isPhoneRequired = ref(false);
    const cardTypes = ref([]);
    const form = ref({
      address: "",
      cardNumber: "",
      phone: "",
      selectedCardTypeId: null,
      selectedCardTypeDisplay: "",
      imageProfile: null,
      // Base64
      imageFront: null,
      // Base64
      imageBack: null
      // Base64
    });
    const profilePreview = ref(null);
    const frontPreview = ref(null);
    const backPreview = ref(null);
    const handleImageSelect = async (e, type) => {
      var _a;
      const target = e.target;
      const file = (_a = target.files) == null ? void 0 : _a[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Fichier trop lourd", {
          description: "La taille maximale est de 5 Mo."
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        var _a2, _b;
        const base64 = ((_a2 = event.target) == null ? void 0 : _a2.result).split(",")[1];
        const preview = (_b = event.target) == null ? void 0 : _b.result;
        if (type === "profile") {
          form.value.imageProfile = base64;
          profilePreview.value = preview;
        } else if (type === "front") {
          form.value.imageFront = base64;
          frontPreview.value = preview;
        } else if (type === "back") {
          form.value.imageBack = base64;
          backPreview.value = preview;
        }
      };
      reader.readAsDataURL(file);
    };
    const removeImage = (type) => {
      if (type === "profile") {
        form.value.imageProfile = null;
        profilePreview.value = null;
      } else if (type === "front") {
        form.value.imageFront = null;
        frontPreview.value = null;
      } else if (type === "back") {
        form.value.imageBack = null;
        backPreview.value = null;
      }
    };
    const submitCertification = async () => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!form.value.imageProfile) {
        toast.error("Erreur", { description: "Photo de profil requise." });
        return;
      }
      if (!form.value.selectedCardTypeId) {
        toast.error("Erreur", { description: "Veuillez choisir un type de document." });
        return;
      }
      if (!form.value.imageFront) {
        toast.error("Erreur", { description: "Photo recto du document requise." });
        return;
      }
      if (form.value.selectedCardTypeId !== 2 && !form.value.imageBack) {
        toast.error("Erreur", { description: "Photo verso du document requise." });
        return;
      }
      isLoading.value = true;
      try {
        const apiBase = config.public.apiBase;
        const memberId = ((_a = auth.profile) == null ? void 0 : _a.id) || ((_b = auth.user) == null ? void 0 : _b.userId);
        if (!memberId) throw new Error("Identifiant membre introuvable");
        const profileUrl = joinApi(apiBase, `${ApiEndpoints.updateProfilePicture}/${memberId}/profile`);
        await $fetch(profileUrl, {
          method: "PUT",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: { images: form.value.imageProfile }
        });
        const verificationUrl = joinApi(apiBase, `${ApiEndpoints.protectedMembers}/${memberId}`);
        const payload = {
          lastName: "",
          // Kept empty as per Flutter request
          firstName: "",
          address: form.value.address,
          cardFront: form.value.imageFront,
          cardBack: form.value.imageBack || "",
          typeCardId: form.value.selectedCardTypeId,
          numberCard: form.value.cardNumber,
          user: {
            email: ((_c = auth.user) == null ? void 0 : _c.email) || "string",
            phone: isPhoneRequired.value ? form.value.phone : (_d = auth.user) == null ? void 0 : _d.phone,
            city: ((_e = auth.user) == null ? void 0 : _e.city) || "",
            country: ((_f = auth.user) == null ? void 0 : _f.country) || ""
          }
        };
        await $fetch(verificationUrl, {
          method: "PUT",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: payload
        });
        toast.success("V\xE9rification envoy\xE9e !", {
          description: "Vos documents sont en cours de validation par nos services."
        });
        setTimeout(() => {
          navigateTo("/dashboard");
        }, 2e3);
      } catch (e) {
        console.error("Certification error:", e);
        toast.error("\xC9chec de l'envoi", {
          description: ((_g = e.data) == null ? void 0 : _g.message) || "Une erreur est survenue lors de la certification."
        });
      } finally {
        isLoading.value = false;
      }
    };
    const isPassport = computed(() => form.value.selectedCardTypeId === 2);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700" }, _attrs))} data-v-60fadc83><div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100" data-v-60fadc83><div class="flex-1 space-y-2 text-center md:text-left" data-v-60fadc83><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-2" data-v-60fadc83>`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-3" }, null, _parent));
      _push(` S\xE9curit\xE9 &amp; Conformit\xE9 </div><h1 class="text-3xl font-black tracking-tight text-slate-900 md:text-4xl" data-v-60fadc83>Faites certifier votre compte</h1><p class="text-slate-500 max-w-lg mx-auto md:mx-0" data-v-60fadc83> La certification est indispensable pour publier des annonces et acc\xE9der aux fonctionnalit\xE9s premium de CasaNayo. </p></div><div class="size-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 rotate-3" data-v-60fadc83>`);
      _push(ssrRenderComponent(unref(CreditCard), { class: "size-10 text-white" }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" data-v-60fadc83><div class="lg:col-span-4 space-y-6" data-v-60fadc83>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { class: "rounded-[2.5rem] border-none shadow-md overflow-hidden bg-white" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$1), { class: "pb-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "text-sm font-black uppercase tracking-widest text-slate-400" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Pourquoi se certifier ?`);
                      } else {
                        return [
                          createTextVNode("Pourquoi se certifier ?")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$2), { class: "text-sm font-black uppercase tracking-widest text-slate-400" }, {
                      default: withCtx(() => [
                        createTextVNode("Pourquoi se certifier ?")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "space-y-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList([
                    { t: "Confiance accrue", d: "Les membres certifi\xE9s re\xE7oivent 3x plus de sollicitations.", icon: unref(CheckCircle2) },
                    { t: "Visibilit\xE9 boost\xE9e", d: "Vos annonces apparaissent en priorit\xE9 dans les recherches.", icon: unref(Sparkles) },
                    { t: "Acc\xE8s total", d: "Publiez sans limite et contactez directement les agences.", icon: unref(LayoutDashboard) }
                  ], (item, i) => {
                    _push3(`<div class="flex gap-4 group" data-v-60fadc83${_scopeId2}><div class="size-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors" data-v-60fadc83${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "size-5 text-slate-400 group-hover:text-blue-600" }, null), _parent3, _scopeId2);
                    _push3(`</div><div class="space-y-0.5" data-v-60fadc83${_scopeId2}><h4 class="text-sm font-black text-slate-800" data-v-60fadc83${_scopeId2}>${ssrInterpolate(item.t)}</h4><p class="text-xs text-slate-500 leading-relaxed" data-v-60fadc83${_scopeId2}>${ssrInterpolate(item.d)}</p></div></div>`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList([
                      { t: "Confiance accrue", d: "Les membres certifi\xE9s re\xE7oivent 3x plus de sollicitations.", icon: unref(CheckCircle2) },
                      { t: "Visibilit\xE9 boost\xE9e", d: "Vos annonces apparaissent en priorit\xE9 dans les recherches.", icon: unref(Sparkles) },
                      { t: "Acc\xE8s total", d: "Publiez sans limite et contactez directement les agences.", icon: unref(LayoutDashboard) }
                    ], (item, i) => {
                      return openBlock(), createBlock("div", {
                        key: i,
                        class: "flex gap-4 group"
                      }, [
                        createVNode("div", { class: "size-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors" }, [
                          (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "size-5 text-slate-400 group-hover:text-blue-600" }))
                        ]),
                        createVNode("div", { class: "space-y-0.5" }, [
                          createVNode("h4", { class: "text-sm font-black text-slate-800" }, toDisplayString(item.t), 1),
                          createVNode("p", { class: "text-xs text-slate-500 leading-relaxed" }, toDisplayString(item.d), 1)
                        ])
                      ]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$1), { class: "pb-2" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$2), { class: "text-sm font-black uppercase tracking-widest text-slate-400" }, {
                    default: withCtx(() => [
                      createTextVNode("Pourquoi se certifier ?")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), { class: "space-y-4" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList([
                    { t: "Confiance accrue", d: "Les membres certifi\xE9s re\xE7oivent 3x plus de sollicitations.", icon: unref(CheckCircle2) },
                    { t: "Visibilit\xE9 boost\xE9e", d: "Vos annonces apparaissent en priorit\xE9 dans les recherches.", icon: unref(Sparkles) },
                    { t: "Acc\xE8s total", d: "Publiez sans limite et contactez directement les agences.", icon: unref(LayoutDashboard) }
                  ], (item, i) => {
                    return openBlock(), createBlock("div", {
                      key: i,
                      class: "flex gap-4 group"
                    }, [
                      createVNode("div", { class: "size-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors" }, [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "size-5 text-slate-400 group-hover:text-blue-600" }))
                      ]),
                      createVNode("div", { class: "space-y-0.5" }, [
                        createVNode("h4", { class: "text-sm font-black text-slate-800" }, toDisplayString(item.t), 1),
                        createVNode("p", { class: "text-xs text-slate-500 leading-relaxed" }, toDisplayString(item.d), 1)
                      ])
                    ]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group" data-v-60fadc83><div class="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" data-v-60fadc83></div>`);
      _push(ssrRenderComponent(unref(Info), { class: "size-8 mb-4 opacity-50" }, null, _parent));
      _push(`<h4 class="font-black text-lg mb-2 leading-tight" data-v-60fadc83>Besoin d&#39;aide ?</h4><p class="text-white/70 text-sm italic mb-6 leading-relaxed" data-v-60fadc83> Notre \xE9quipe v\xE9rifie vos documents sous 24h \xE0 48h ouvr\xE9es. Assurez-vous que les photos sont nettes et lisibles. </p>`);
      _push(ssrRenderComponent(unref(_sfc_main$4), {
        variant: "secondary",
        class: "w-full rounded-2xl font-black text-xs uppercase tracking-widest h-12"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contacter le support `);
          } else {
            return [
              createTextVNode(" Contacter le support ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="lg:col-span-8" data-v-60fadc83>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { class: "rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden font-sans" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$1), { class: "px-8 pt-10 pb-6 border-b border-slate-50" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "text-xl font-black flex items-center gap-3" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(User), { class: "size-6 text-blue-600" }, null, _parent4, _scopeId3));
                        _push4(` V\xE9rification d&#39;identit\xE9 `);
                      } else {
                        return [
                          createVNode(unref(User), { class: "size-6 text-blue-600" }),
                          createTextVNode(" V\xE9rification d'identit\xE9 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$2), { class: "text-xl font-black flex items-center gap-3" }, {
                      default: withCtx(() => [
                        createVNode(unref(User), { class: "size-6 text-blue-600" }),
                        createTextVNode(" V\xE9rification d'identit\xE9 ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "px-8 py-10 space-y-10" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-6" data-v-60fadc83${_scopeId2}><div class="flex items-center gap-4" data-v-60fadc83${_scopeId2}><div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" data-v-60fadc83${_scopeId2}>01</div><h3 class="font-black text-lg tracking-tight" data-v-60fadc83${_scopeId2}>Photo de profil</h3></div><div class="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-blue-300 transition-all bg-slate-50/30 group" data-v-60fadc83${_scopeId2}><div class="relative mb-6" data-v-60fadc83${_scopeId2}><div class="size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-200" data-v-60fadc83${_scopeId2}>`);
                  if (profilePreview.value) {
                    _push3(`<img${ssrRenderAttr("src", profilePreview.value)} class="size-full object-cover" data-v-60fadc83${_scopeId2}>`);
                  } else {
                    _push3(`<div class="size-full flex items-center justify-center" data-v-60fadc83${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(User), { class: "size-16 text-slate-400" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(`</div><label for="profile-upload" class="absolute bottom-0 right-0 z-20 size-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Camera), { class: "size-5" }, null, _parent3, _scopeId2));
                  _push3(`</label><input id="profile-upload" type="file" accept="image/*" class="hidden" data-v-60fadc83${_scopeId2}></div><div class="text-center" data-v-60fadc83${_scopeId2}><p class="text-sm font-black text-slate-900 mb-1" data-v-60fadc83${_scopeId2}>Votre visage doit \xEAtre clairement visible</p><p class="text-xs text-slate-400" data-v-60fadc83${_scopeId2}>Format JPG, PNG ou WEBP. Max 5MB.</p></div></div></div><div class="space-y-8" data-v-60fadc83${_scopeId2}><div class="flex items-center gap-4" data-v-60fadc83${_scopeId2}><div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" data-v-60fadc83${_scopeId2}>02</div><h3 class="font-black text-lg tracking-tight" data-v-60fadc83${_scopeId2}>Informations de contact</h3></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-60fadc83${_scopeId2}><div class="space-y-2 group" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Adresse de r\xE9sidence`);
                      } else {
                        return [
                          createTextVNode("Adresse de r\xE9sidence")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="relative" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(MapPin), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    modelValue: form.value.address,
                    "onUpdate:modelValue": ($event) => form.value.address = $event,
                    placeholder: "Gombe, Kinshasa",
                    class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  if (isPhoneRequired.value) {
                    _push3(`<div class="space-y-2 group" data-v-60fadc83${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Num\xE9ro de t\xE9l\xE9phone`);
                        } else {
                          return [
                            createTextVNode("Num\xE9ro de t\xE9l\xE9phone")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="relative" data-v-60fadc83${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Phone), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      modelValue: form.value.phone,
                      "onUpdate:modelValue": ($event) => form.value.phone = $event,
                      placeholder: "+243...",
                      class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="space-y-2 group" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Num\xE9ro du document (Optionnel)`);
                      } else {
                        return [
                          createTextVNode("Num\xE9ro du document (Optionnel)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="relative" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(CreditCard), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    modelValue: form.value.cardNumber,
                    "onUpdate:modelValue": ($event) => form.value.cardNumber = $event,
                    placeholder: "N\xB0 de carte ou passeport",
                    class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div></div></div><div class="space-y-8 pt-4" data-v-60fadc83${_scopeId2}><div class="flex items-center gap-4" data-v-60fadc83${_scopeId2}><div class="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" data-v-60fadc83${_scopeId2}>03</div><h3 class="font-black text-lg tracking-tight" data-v-60fadc83${_scopeId2}>Pi\xE8ce d&#39;identit\xE9 officielle</h3></div><div class="space-y-4" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Choisir le type de document`);
                      } else {
                        return [
                          createTextVNode("Choisir le type de document")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex flex-wrap gap-3" data-v-60fadc83${_scopeId2}><!--[-->`);
                  ssrRenderList(cardTypes.value, (type) => {
                    _push3(`<button class="${ssrRenderClass([form.value.selectedCardTypeId === type.id ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30", "px-6 py-4 rounded-2xl font-bold transition-all border outline-none active:scale-95"])}" data-v-60fadc83${_scopeId2}>${ssrInterpolate(type.name)}</button>`);
                  });
                  _push3(`<!--]--></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" data-v-60fadc83${_scopeId2}><div class="space-y-3" data-v-60fadc83${_scopeId2}><span class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" data-v-60fadc83${_scopeId2}>DOCUMENT \u2014 FACE AVANT</span><div class="relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" data-v-60fadc83${_scopeId2}>`);
                  if (frontPreview.value) {
                    _push3(`<div class="absolute inset-0" data-v-60fadc83${_scopeId2}><img${ssrRenderAttr("src", frontPreview.value)} class="size-full object-cover" data-v-60fadc83${_scopeId2}><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-60fadc83${_scopeId2}><button class="size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors" data-v-60fadc83${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(X), { class: "size-6 mx-auto" }, null, _parent3, _scopeId2));
                    _push3(`</button></div></div>`);
                  } else {
                    _push3(`<label for="front-id-upload" class="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6" data-v-60fadc83${_scopeId2}><div class="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all" data-v-60fadc83${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" }, null, _parent3, _scopeId2));
                    _push3(`</div><span class="text-sm font-black text-slate-400 group-hover:text-blue-600" data-v-60fadc83${_scopeId2}>Prendre photo (Recto)</span></label>`);
                  }
                  _push3(`<input id="front-id-upload" type="file" accept="image/*" class="hidden" data-v-60fadc83${_scopeId2}></div></div>`);
                  if (!isPassport.value) {
                    _push3(`<div class="space-y-3" data-v-60fadc83${_scopeId2}><span class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" data-v-60fadc83${_scopeId2}>DOCUMENT \u2014 FACE ARRI\xC8RE</span><div class="relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" data-v-60fadc83${_scopeId2}>`);
                    if (backPreview.value) {
                      _push3(`<div class="absolute inset-0" data-v-60fadc83${_scopeId2}><img${ssrRenderAttr("src", backPreview.value)} class="size-full object-cover" data-v-60fadc83${_scopeId2}><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-60fadc83${_scopeId2}><button class="size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors" data-v-60fadc83${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(X), { class: "size-6 mx-auto" }, null, _parent3, _scopeId2));
                      _push3(`</button></div></div>`);
                    } else {
                      _push3(`<label for="back-id-upload" class="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6" data-v-60fadc83${_scopeId2}><div class="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all" data-v-60fadc83${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" }, null, _parent3, _scopeId2));
                      _push3(`</div><span class="text-sm font-black text-slate-400 group-hover:text-blue-600" data-v-60fadc83${_scopeId2}>Prendre photo (Verso)</span></label>`);
                    }
                    _push3(`<input id="back-id-upload" type="file" accept="image/*" class="hidden" data-v-60fadc83${_scopeId2}></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div class="pt-10 border-t border-slate-50" data-v-60fadc83${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$4), {
                    onClick: submitCertification,
                    disabled: isLoading.value,
                    class: "w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (isLoading.value) {
                          _push4(`<!--[-->`);
                          _push4(ssrRenderComponent(unref(Loader2), { class: "size-6 animate-spin mr-3" }, null, _parent4, _scopeId3));
                          _push4(` Transmission en cours... <!--]-->`);
                        } else {
                          _push4(`<!--[--> Soumettre mon dossier de certification `);
                          _push4(ssrRenderComponent(unref(ChevronRight), { class: "size-5 ml-2" }, null, _parent4, _scopeId3));
                          _push4(`<!--]-->`);
                        }
                      } else {
                        return [
                          isLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode(unref(Loader2), { class: "size-6 animate-spin mr-3" }),
                            createTextVNode(" Transmission en cours... ")
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createTextVNode(" Soumettre mon dossier de certification "),
                            createVNode(unref(ChevronRight), { class: "size-5 ml-2" })
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-center text-[10px] font-medium text-slate-400 mt-6 max-w-sm mx-auto italic leading-relaxed" data-v-60fadc83${_scopeId2}> En soumettant ce formulaire, vous certifiez l&#39;exactitude des informations fournies. Les faux comptes sont passibles de suspension imm\xE9diate. </p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "01"),
                        createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Photo de profil")
                      ]),
                      createVNode("div", { class: "flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-blue-300 transition-all bg-slate-50/30 group" }, [
                        createVNode("div", { class: "relative mb-6" }, [
                          createVNode("div", { class: "size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-200" }, [
                            profilePreview.value ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: profilePreview.value,
                              class: "size-full object-cover"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "size-full flex items-center justify-center"
                            }, [
                              createVNode(unref(User), { class: "size-16 text-slate-400" })
                            ]))
                          ]),
                          createVNode("label", {
                            for: "profile-upload",
                            class: "absolute bottom-0 right-0 z-20 size-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
                          }, [
                            createVNode(unref(Camera), { class: "size-5" })
                          ]),
                          createVNode("input", {
                            id: "profile-upload",
                            type: "file",
                            accept: "image/*",
                            class: "hidden",
                            onChange: (e) => handleImageSelect(e, "profile")
                          }, null, 40, ["onChange"])
                        ]),
                        createVNode("div", { class: "text-center" }, [
                          createVNode("p", { class: "text-sm font-black text-slate-900 mb-1" }, "Votre visage doit \xEAtre clairement visible"),
                          createVNode("p", { class: "text-xs text-slate-400" }, "Format JPG, PNG ou WEBP. Max 5MB.")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "space-y-8" }, [
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "02"),
                        createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Informations de contact")
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                        createVNode("div", { class: "space-y-2 group" }, [
                          createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                            default: withCtx(() => [
                              createTextVNode("Adresse de r\xE9sidence")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "relative" }, [
                            createVNode(unref(MapPin), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                            createVNode(unref(_sfc_main$6), {
                              modelValue: form.value.address,
                              "onUpdate:modelValue": ($event) => form.value.address = $event,
                              placeholder: "Gombe, Kinshasa",
                              class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        isPhoneRequired.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "space-y-2 group"
                        }, [
                          createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                            default: withCtx(() => [
                              createTextVNode("Num\xE9ro de t\xE9l\xE9phone")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "relative" }, [
                            createVNode(unref(Phone), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                            createVNode(unref(_sfc_main$6), {
                              modelValue: form.value.phone,
                              "onUpdate:modelValue": ($event) => form.value.phone = $event,
                              placeholder: "+243...",
                              class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "space-y-2 group" }, [
                          createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                            default: withCtx(() => [
                              createTextVNode("Num\xE9ro du document (Optionnel)")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "relative" }, [
                            createVNode(unref(CreditCard), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                            createVNode(unref(_sfc_main$6), {
                              modelValue: form.value.cardNumber,
                              "onUpdate:modelValue": ($event) => form.value.cardNumber = $event,
                              placeholder: "N\xB0 de carte ou passeport",
                              class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "space-y-8 pt-4" }, [
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "03"),
                        createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Pi\xE8ce d'identit\xE9 officielle")
                      ]),
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400" }, {
                          default: withCtx(() => [
                            createTextVNode("Choisir le type de document")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex flex-wrap gap-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(cardTypes.value, (type) => {
                            return openBlock(), createBlock("button", {
                              key: type.id,
                              onClick: ($event) => form.value.selectedCardTypeId = type.id,
                              class: ["px-6 py-4 rounded-2xl font-bold transition-all border outline-none active:scale-95", form.value.selectedCardTypeId === type.id ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"]
                            }, toDisplayString(type.name), 11, ["onClick"]);
                          }), 128))
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" }, [
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("span", { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" }, "DOCUMENT \u2014 FACE AVANT"),
                          createVNode("div", { class: "relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" }, [
                            frontPreview.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "absolute inset-0"
                            }, [
                              createVNode("img", {
                                src: frontPreview.value,
                                class: "size-full object-cover"
                              }, null, 8, ["src"]),
                              createVNode("div", { class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, [
                                createVNode("button", {
                                  onClick: ($event) => removeImage("front"),
                                  class: "size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                                }, [
                                  createVNode(unref(X), { class: "size-6 mx-auto" })
                                ], 8, ["onClick"])
                              ])
                            ])) : (openBlock(), createBlock("label", {
                              key: 1,
                              for: "front-id-upload",
                              class: "absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6"
                            }, [
                              createVNode("div", { class: "size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all" }, [
                                createVNode(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" })
                              ]),
                              createVNode("span", { class: "text-sm font-black text-slate-400 group-hover:text-blue-600" }, "Prendre photo (Recto)")
                            ])),
                            createVNode("input", {
                              id: "front-id-upload",
                              type: "file",
                              accept: "image/*",
                              class: "hidden",
                              onChange: (e) => handleImageSelect(e, "front")
                            }, null, 40, ["onChange"])
                          ])
                        ]),
                        !isPassport.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "space-y-3"
                        }, [
                          createVNode("span", { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" }, "DOCUMENT \u2014 FACE ARRI\xC8RE"),
                          createVNode("div", { class: "relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" }, [
                            backPreview.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "absolute inset-0"
                            }, [
                              createVNode("img", {
                                src: backPreview.value,
                                class: "size-full object-cover"
                              }, null, 8, ["src"]),
                              createVNode("div", { class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, [
                                createVNode("button", {
                                  onClick: ($event) => removeImage("back"),
                                  class: "size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                                }, [
                                  createVNode(unref(X), { class: "size-6 mx-auto" })
                                ], 8, ["onClick"])
                              ])
                            ])) : (openBlock(), createBlock("label", {
                              key: 1,
                              for: "back-id-upload",
                              class: "absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6"
                            }, [
                              createVNode("div", { class: "size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all" }, [
                                createVNode(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" })
                              ]),
                              createVNode("span", { class: "text-sm font-black text-slate-400 group-hover:text-blue-600" }, "Prendre photo (Verso)")
                            ])),
                            createVNode("input", {
                              id: "back-id-upload",
                              type: "file",
                              accept: "image/*",
                              class: "hidden",
                              onChange: (e) => handleImageSelect(e, "back")
                            }, null, 40, ["onChange"])
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "pt-10 border-t border-slate-50" }, [
                      createVNode(unref(_sfc_main$4), {
                        onClick: submitCertification,
                        disabled: isLoading.value,
                        class: "w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70"
                      }, {
                        default: withCtx(() => [
                          isLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode(unref(Loader2), { class: "size-6 animate-spin mr-3" }),
                            createTextVNode(" Transmission en cours... ")
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createTextVNode(" Soumettre mon dossier de certification "),
                            createVNode(unref(ChevronRight), { class: "size-5 ml-2" })
                          ], 64))
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode("p", { class: "text-center text-[10px] font-medium text-slate-400 mt-6 max-w-sm mx-auto italic leading-relaxed" }, " En soumettant ce formulaire, vous certifiez l'exactitude des informations fournies. Les faux comptes sont passibles de suspension imm\xE9diate. ")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$1), { class: "px-8 pt-10 pb-6 border-b border-slate-50" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$2), { class: "text-xl font-black flex items-center gap-3" }, {
                    default: withCtx(() => [
                      createVNode(unref(User), { class: "size-6 text-blue-600" }),
                      createTextVNode(" V\xE9rification d'identit\xE9 ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), { class: "px-8 py-10 space-y-10" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "01"),
                      createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Photo de profil")
                    ]),
                    createVNode("div", { class: "flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-blue-300 transition-all bg-slate-50/30 group" }, [
                      createVNode("div", { class: "relative mb-6" }, [
                        createVNode("div", { class: "size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-200" }, [
                          profilePreview.value ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: profilePreview.value,
                            class: "size-full object-cover"
                          }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "size-full flex items-center justify-center"
                          }, [
                            createVNode(unref(User), { class: "size-16 text-slate-400" })
                          ]))
                        ]),
                        createVNode("label", {
                          for: "profile-upload",
                          class: "absolute bottom-0 right-0 z-20 size-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
                        }, [
                          createVNode(unref(Camera), { class: "size-5" })
                        ]),
                        createVNode("input", {
                          id: "profile-upload",
                          type: "file",
                          accept: "image/*",
                          class: "hidden",
                          onChange: (e) => handleImageSelect(e, "profile")
                        }, null, 40, ["onChange"])
                      ]),
                      createVNode("div", { class: "text-center" }, [
                        createVNode("p", { class: "text-sm font-black text-slate-900 mb-1" }, "Votre visage doit \xEAtre clairement visible"),
                        createVNode("p", { class: "text-xs text-slate-400" }, "Format JPG, PNG ou WEBP. Max 5MB.")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-8" }, [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "02"),
                      createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Informations de contact")
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                      createVNode("div", { class: "space-y-2 group" }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                          default: withCtx(() => [
                            createTextVNode("Adresse de r\xE9sidence")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(MapPin), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                          createVNode(unref(_sfc_main$6), {
                            modelValue: form.value.address,
                            "onUpdate:modelValue": ($event) => form.value.address = $event,
                            placeholder: "Gombe, Kinshasa",
                            class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      isPhoneRequired.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-2 group"
                      }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                          default: withCtx(() => [
                            createTextVNode("Num\xE9ro de t\xE9l\xE9phone")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(Phone), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                          createVNode(unref(_sfc_main$6), {
                            modelValue: form.value.phone,
                            "onUpdate:modelValue": ($event) => form.value.phone = $event,
                            placeholder: "+243...",
                            class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "space-y-2 group" }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors" }, {
                          default: withCtx(() => [
                            createTextVNode("Num\xE9ro du document (Optionnel)")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(CreditCard), { class: "absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" }),
                          createVNode(unref(_sfc_main$6), {
                            modelValue: form.value.cardNumber,
                            "onUpdate:modelValue": ($event) => form.value.cardNumber = $event,
                            placeholder: "N\xB0 de carte ou passeport",
                            class: "h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-8 pt-4" }, [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("div", { class: "size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 italic font-black text-blue-600 text-sm" }, "03"),
                      createVNode("h3", { class: "font-black text-lg tracking-tight" }, "Pi\xE8ce d'identit\xE9 officielle")
                    ]),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest text-slate-400" }, {
                        default: withCtx(() => [
                          createTextVNode("Choisir le type de document")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex flex-wrap gap-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(cardTypes.value, (type) => {
                          return openBlock(), createBlock("button", {
                            key: type.id,
                            onClick: ($event) => form.value.selectedCardTypeId = type.id,
                            class: ["px-6 py-4 rounded-2xl font-bold transition-all border outline-none active:scale-95", form.value.selectedCardTypeId === type.id ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"]
                          }, toDisplayString(type.name), 11, ["onClick"]);
                        }), 128))
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" }, [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("span", { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" }, "DOCUMENT \u2014 FACE AVANT"),
                        createVNode("div", { class: "relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" }, [
                          frontPreview.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "absolute inset-0"
                          }, [
                            createVNode("img", {
                              src: frontPreview.value,
                              class: "size-full object-cover"
                            }, null, 8, ["src"]),
                            createVNode("div", { class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, [
                              createVNode("button", {
                                onClick: ($event) => removeImage("front"),
                                class: "size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                              }, [
                                createVNode(unref(X), { class: "size-6 mx-auto" })
                              ], 8, ["onClick"])
                            ])
                          ])) : (openBlock(), createBlock("label", {
                            key: 1,
                            for: "front-id-upload",
                            class: "absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6"
                          }, [
                            createVNode("div", { class: "size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all" }, [
                              createVNode(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" })
                            ]),
                            createVNode("span", { class: "text-sm font-black text-slate-400 group-hover:text-blue-600" }, "Prendre photo (Recto)")
                          ])),
                          createVNode("input", {
                            id: "front-id-upload",
                            type: "file",
                            accept: "image/*",
                            class: "hidden",
                            onChange: (e) => handleImageSelect(e, "front")
                          }, null, 40, ["onChange"])
                        ])
                      ]),
                      !isPassport.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-3"
                      }, [
                        createVNode("span", { class: "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2" }, "DOCUMENT \u2014 FACE ARRI\xC8RE"),
                        createVNode("div", { class: "relative aspect-[1.6/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group overflow-hidden" }, [
                          backPreview.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "absolute inset-0"
                          }, [
                            createVNode("img", {
                              src: backPreview.value,
                              class: "size-full object-cover"
                            }, null, 8, ["src"]),
                            createVNode("div", { class: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, [
                              createVNode("button", {
                                onClick: ($event) => removeImage("back"),
                                class: "size-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                              }, [
                                createVNode(unref(X), { class: "size-6 mx-auto" })
                              ], 8, ["onClick"])
                            ])
                          ])) : (openBlock(), createBlock("label", {
                            key: 1,
                            for: "back-id-upload",
                            class: "absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3 p-6"
                          }, [
                            createVNode("div", { class: "size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all" }, [
                              createVNode(unref(Upload), { class: "size-6 text-slate-300 group-hover:text-blue-600" })
                            ]),
                            createVNode("span", { class: "text-sm font-black text-slate-400 group-hover:text-blue-600" }, "Prendre photo (Verso)")
                          ])),
                          createVNode("input", {
                            id: "back-id-upload",
                            type: "file",
                            accept: "image/*",
                            class: "hidden",
                            onChange: (e) => handleImageSelect(e, "back")
                          }, null, 40, ["onChange"])
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "pt-10 border-t border-slate-50" }, [
                    createVNode(unref(_sfc_main$4), {
                      onClick: submitCertification,
                      disabled: isLoading.value,
                      class: "w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70"
                    }, {
                      default: withCtx(() => [
                        isLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode(unref(Loader2), { class: "size-6 animate-spin mr-3" }),
                          createTextVNode(" Transmission en cours... ")
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createTextVNode(" Soumettre mon dossier de certification "),
                          createVNode(unref(ChevronRight), { class: "size-5 ml-2" })
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["disabled"]),
                    createVNode("p", { class: "text-center text-[10px] font-medium text-slate-400 mt-6 max-w-sm mx-auto italic leading-relaxed" }, " En soumettant ce formulaire, vous certifiez l'exactitude des informations fournies. Les faux comptes sont passibles de suspension imm\xE9diate. ")
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/certification/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-60fadc83"]]);

export { index as default };
//# sourceMappingURL=index-D-wyAsCc.mjs.map
