import { defineComponent, mergeProps, ref, computed, withCtx, createVNode, createTextVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { LayoutDashboard, ChevronDown, Calendar, User, LogOut, Menu, X, Facebook, Twitter, Instagram, Linkedin, Apple, Smartphone, MapPin, Phone, Mail } from 'lucide-vue-next';
import { _ as _sfc_main$4 } from './Button-B_RLy27J.mjs';
import { e as useAuthStore } from './server.mjs';
import { onClickOutside } from '@vueuse/core';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'vue-sonner';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const isMobileMenuOpen = ref(false);
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);
    const auth = useAuthStore();
    onClickOutside(dropdownRef, () => isDropdownOpen.value = false);
    const isAuthenticated = computed(() => auth.isAuthenticated);
    const isAdmin = computed(() => auth.isAdmin);
    const userProfile = computed(() => auth.profile);
    const username = computed(() => {
      var _a;
      return ((_a = auth.user) == null ? void 0 : _a.username) || "Utilisateur";
    });
    const handleLogout = () => {
      auth.logout();
      isDropdownOpen.value = false;
    };
    const navLinks = [
      { name: "Accueil", path: "/" },
      { name: "Propri\xE9t\xE9s", path: "/properties" },
      { name: "Services", path: "/services" },
      { name: "Contact", path: "/contact" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100" }, _attrs))}><div class="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md transition-transform group-hover:scale-105"${_scopeId}><span class="text-2xl font-black text-white italic"${_scopeId}>C</span></div><div class="hidden sm:block"${_scopeId}><span class="text-xl font-black tracking-tight text-slate-800"${_scopeId}>Casa</span><span class="text-xl font-black tracking-tight text-primary"${_scopeId}>Nayo</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md transition-transform group-hover:scale-105" }, [
                createVNode("span", { class: "text-2xl font-black text-white italic" }, "C")
              ]),
              createVNode("div", { class: "hidden sm:block" }, [
                createVNode("span", { class: "text-xl font-black tracking-tight text-slate-800" }, "Casa"),
                createVNode("span", { class: "text-xl font-black tracking-tight text-primary" }, "Nayo")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100"><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.name,
          to: link.path,
          class: "px-5 py-2.5 text-sm font-bold text-slate-500 rounded-xl hover:bg-white hover:text-primary hover:shadow-sm transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="flex items-center gap-4">`);
      if (isAuthenticated.value && isAdmin.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "hidden md:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "size-4" }, null, _parent3, _scopeId2));
                    _push3(` Dashboard ADMIN `);
                  } else {
                    return [
                      createVNode(unref(LayoutDashboard), { class: "size-4" }),
                      createTextVNode(" Dashboard ADMIN ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                  default: withCtx(() => [
                    createVNode(unref(LayoutDashboard), { class: "size-4" }),
                    createTextVNode(" Dashboard ADMIN ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isAuthenticated.value && !isAdmin.value) {
        _push(`<div class="relative"><button class="flex items-center gap-2 p-1 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all group"><div class="size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">`);
        if ((_a = userProfile.value) == null ? void 0 : _a.images) {
          _push(`<img${ssrRenderAttr("src", userProfile.value.images)} class="size-full object-cover">`);
        } else {
          _push(`<div class="size-full flex items-center justify-center text-primary font-black text-xs">${ssrInterpolate(username.value.substring(0, 2).toUpperCase())}</div>`);
        }
        _push(`</div><span class="text-sm font-black text-slate-700 max-w-[100px] truncate">${ssrInterpolate(username.value)}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: ["size-4 text-slate-400 group-hover:text-primary transition-colors", { "rotate-180": isDropdownOpen.value }]
        }, null, _parent));
        _push(`</button>`);
        if (isDropdownOpen.value) {
          _push(`<div class="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2"><div class="p-4 border-b border-slate-50"><p class="text-[10px] font-black tracking-widest text-primary uppercase">Mon Espace Personnel</p><p class="text-lg font-black text-slate-900">${ssrInterpolate(username.value)}</p><p class="text-xs text-slate-400 truncate">${ssrInterpolate((_b = unref(auth).user) == null ? void 0 : _b.email)}</p></div><div class="p-2 space-y-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/my-reservations",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Calendar), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` Mes R\xE9servations `);
              } else {
                return [
                  createVNode(unref(Calendar), { class: "size-4" }),
                  createTextVNode(" Mes R\xE9servations ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` Mon Profil `);
              } else {
                return [
                  createVNode(unref(User), { class: "size-4" }),
                  createTextVNode(" Mon Profil ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all">`);
          _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
          _push(` Se d\xE9connecter </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isAuthenticated.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "hidden md:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Se connecter `);
                  } else {
                    return [
                      createTextVNode(" Se connecter ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), { class: "h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95" }, {
                  default: withCtx(() => [
                    createTextVNode(" Se connecter ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">`);
      if (!isMobileMenuOpen.value) {
        _push(ssrRenderComponent(unref(Menu), { class: "h-6 w-6" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(X), { class: "h-6 w-6" }, null, _parent));
      }
      _push(`</button></div></div>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="lg:hidden border-t border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top w-full"><nav class="flex flex-col p-4 gap-2"><!--[-->`);
        ssrRenderList(navLinks, (link) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: link.name,
            to: link.path,
            onClick: ($event) => isMobileMenuOpen.value = false,
            class: "block text-base font-bold text-slate-700 hover:text-primary hover:bg-slate-50 py-3 px-5 rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--><div class="pt-4 mt-2 border-t border-slate-100 space-y-2">`);
        if (isAuthenticated.value && isAdmin.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "w-full h-12 font-black bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 transition-all" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "size-5" }, null, _parent3, _scopeId2));
                      _push3(` Dashboard Admin `);
                    } else {
                      return [
                        createVNode(unref(LayoutDashboard), { class: "size-5" }),
                        createTextVNode(" Dashboard Admin ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$4), { class: "w-full h-12 font-black bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 transition-all" }, {
                    default: withCtx(() => [
                      createVNode(unref(LayoutDashboard), { class: "size-5" }),
                      createTextVNode(" Dashboard Admin ")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isAuthenticated.value && !isAdmin.value) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/my-reservations",
            onClick: ($event) => isMobileMenuOpen.value = false,
            class: "flex items-center gap-3 px-5 py-3 text-base font-bold text-slate-600 rounded-2xl"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Calendar), { class: "size-5" }, null, _parent2, _scopeId));
                _push2(` Mes R\xE9servations `);
              } else {
                return [
                  createVNode(unref(Calendar), { class: "size-5" }),
                  createTextVNode(" Mes R\xE9servations ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            onClick: ($event) => isMobileMenuOpen.value = false,
            class: "flex items-center gap-3 px-5 py-3 text-base font-bold text-slate-600 rounded-2xl"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "size-5" }, null, _parent2, _scopeId));
                _push2(` Mon Profil `);
              } else {
                return [
                  createVNode(unref(User), { class: "size-5" }),
                  createTextVNode(" Mon Profil ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(_sfc_main$4), {
            onClick: handleLogout,
            variant: "ghost",
            class: "w-full h-12 font-black text-red-500 rounded-2xl bg-red-50 flex items-center justify-center gap-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(LogOut), { class: "size-5" }, null, _parent2, _scopeId));
                _push2(` D\xE9connexion `);
              } else {
                return [
                  createVNode(unref(LogOut), { class: "size-5" }),
                  createTextVNode(" D\xE9connexion ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (!isAuthenticated.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "w-full h-12 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Se connecter `);
                    } else {
                      return [
                        createTextVNode(" Se connecter ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$4), { class: "w-full h-12 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2" }, {
                    default: withCtx(() => [
                      createTextVNode(" Se connecter ")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></nav></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Navbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-white text-slate-900 pt-24 pb-12 overflow-hidden relative border-t border-slate-100" }, _attrs))}><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-sky-400 opacity-20"></div><div class="absolute -top-24 -right-24 size-96 bg-primary/5 rounded-full blur-[100px]"></div><div class="absolute -bottom-24 -left-24 size-96 bg-blue-600/5 rounded-full blur-[100px]"></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16"><div class="lg:col-span-4 space-y-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/20"${_scopeId}><span class="text-2xl font-black text-white"${_scopeId}>C</span></div><div class="flex flex-col"${_scopeId}><span class="text-2xl font-black tracking-tight leading-none text-slate-900"${_scopeId}>CasaNayo</span><span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1"${_scopeId}>Immobilier &amp; Services</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-xl shadow-primary/20" }, [
                createVNode("span", { class: "text-2xl font-black text-white" }, "C")
              ]),
              createVNode("div", { class: "flex flex-col" }, [
                createVNode("span", { class: "text-2xl font-black tracking-tight leading-none text-slate-900" }, "CasaNayo"),
                createVNode("span", { class: "text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1" }, "Immobilier & Services")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-slate-500 text-base leading-relaxed max-w-sm"> CasaNayo red\xE9finit l&#39;exp\xE9rience immobili\xE8re en Afrique. Nous connectons les propri\xE9taires, les acheteurs et les professionnels de service sur une plateforme unique, s\xE9curis\xE9e et intuitive. </p><div class="flex gap-4"><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Facebook), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Twitter), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Instagram), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Linkedin), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a></div></div><div class="lg:col-span-2 text-left"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> Menu <span class="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span></h3><ul class="space-y-4"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Accueil`);
          } else {
            return [
              createTextVNode(" Accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/properties",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Propri\xE9t\xE9s`);
          } else {
            return [
              createTextVNode(" Propri\xE9t\xE9s")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Services`);
          } else {
            return [
              createTextVNode(" Services")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact`);
          } else {
            return [
              createTextVNode(" Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="lg:col-span-2 text-left"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> L\xE9gal <span class="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span></h3><ul class="space-y-4 font-bold text-left"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terms",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Conditions d&#39;utilisation`);
          } else {
            return [
              createTextVNode(" Conditions d'utilisation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Confidentialit\xE9`);
          } else {
            return [
              createTextVNode(" Confidentialit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/booking-policy",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Politique de R\xE9servation`);
          } else {
            return [
              createTextVNode(" Politique de R\xE9servation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/legal",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mentions l\xE9gales`);
          } else {
            return [
              createTextVNode(" Mentions l\xE9gales")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="lg:col-span-4 space-y-8"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> T\xE9l\xE9charger l&#39;App <span class="absolute -bottom-2 left-0 w-8 h-1 bg-sky-400 rounded-full"></span></h3><div class="flex flex-col sm:flex-row gap-4"><button class="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group">`);
      _push(ssrRenderComponent(unref(Apple), { class: "size-6 fill-current" }, null, _parent));
      _push(`<div class="text-left"><div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">App Store</div><div class="text-sm font-black leading-tight">iOS App</div></div></button><button class="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group">`);
      _push(ssrRenderComponent(unref(Smartphone), { class: "size-6 text-primary" }, null, _parent));
      _push(`<div class="text-left"><div class="text-[0.6rem] uppercase font-bold tracking-wider opacity-60 leading-none">Play Store</div><div class="text-sm font-black leading-tight">Android</div></div></button></div></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-100 mt-8"><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-5 text-primary group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Si\xE8ge Social</p><p class="text-sm font-bold text-slate-800 leading-snug"> Av. S\xE9n\xE9galais, Gare Centrale<br> Kinshasa Gombe, RDC </p></div></div><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-5 text-blue-500 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Contact</p><p class="text-sm font-bold text-slate-800">+243 836 323 805</p></div></div><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-5 text-sky-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Support</p><p class="text-sm font-bold text-slate-800">contact@casanayo.com</p></div></div></div><div class="pt-8 text-center sm:flex sm:justify-between sm:text-left"><p class="text-sm text-slate-400 font-medium"> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} <span class="text-slate-900 font-bold">CasaNayo</span>. Fi\xE8rement d\xE9velopp\xE9 pour l&#39;excellence. </p><div class="mt-4 sm:mt-0 flex gap-6 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Confidentialit\xE9`);
          } else {
            return [
              createTextVNode("Confidentialit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/booking-policy",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`R\xE9servation`);
          } else {
            return [
              createTextVNode("R\xE9servation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cookies",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cookies`);
          } else {
            return [
              createTextVNode("Cookies")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/security",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`S\xE9curit\xE9`);
          } else {
            return [
              createTextVNode("S\xE9curit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CustomCursor",
  __ssrInlineRender: true,
  setup(__props) {
    const cursorX = ref(0);
    const cursorY = ref(0);
    const cursorOutlineX = ref(0);
    const cursorOutlineY = ref(0);
    const isHovering = ref(false);
    const isClicking = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 pointer-events-none z-[9999] hidden lg:block" }, _attrs))}><div style="${ssrRenderStyle({ left: `${cursorX.value}px`, top: `${cursorY.value}px` })}" class="${ssrRenderClass([{ "scale-0": isHovering.value }, "fixed w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"])}"></div><div style="${ssrRenderStyle({
        left: `${cursorOutlineX.value}px`,
        top: `${cursorOutlineY.value}px`,
        width: isHovering.value ? "60px" : "40px",
        height: isHovering.value ? "60px" : "40px",
        opacity: isHovering.value ? "0.5" : "0.3",
        backgroundColor: isHovering.value ? "rgba(var(--primary-rgb), 0.1)" : "transparent"
      })}" class="${ssrRenderClass([{ "scale-90": isClicking.value }, "fixed border-2 border-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"])}"></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CustomCursor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background font-sans antialiased text-foreground" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CJEFtaft.mjs.map
