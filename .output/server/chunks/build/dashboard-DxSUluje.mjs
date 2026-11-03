import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { LayoutDashboard, Building2, Calendar, CreditCard, Receipt, Home, BarChart3, Wrench, ShieldCheck, Briefcase, Settings, MapPin, Users, ChevronLeft, LogOut, Menu, Search, Bell, User, AlertOctagon } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1 } from './Sheet-C_ZQdICj.mjs';
import { _ as _export_sfc, m as useRoute, a as useRouter, l as useAuthStore, n as navigateTo } from './server.mjs';
import { onClickOutside } from '@vueuse/core';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const _imports_0 = "" + buildAssetsURL("logoCasa.BQKMWGgL.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    const isMobileMenuOpen = ref(false);
    const isSidebarCollapsed = ref(false);
    const isUserMenuOpen = ref(false);
    const userMenuRef = ref(null);
    const showLogoutModal = ref(false);
    const mainContentRef = ref(null);
    watch(() => route.path, () => {
      if (mainContentRef.value) {
        mainContentRef.value.scrollTop = 0;
      }
    });
    const isGerantOnly = computed(() => auth.isGerant && !auth.isAdmin);
    const userProfile = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g;
      return {
        name: ((_a = auth.profile) == null ? void 0 : _a.fullName) || ((_b = auth.user) == null ? void 0 : _b.username) || "Utilisateur",
        firstName: (((_c = auth.profile) == null ? void 0 : _c.fullName) || ((_d = auth.user) == null ? void 0 : _d.username) || "Utilisateur").split(" ")[0],
        role: auth.isAdmin ? "Administrateur" : auth.isGerant ? "G\xE9rant h\xF4tel" : ((_e = auth.user) == null ? void 0 : _e.premium) ? "Membre Premium" : "Membre",
        avatar: ((_f = auth.profile) == null ? void 0 : _f.images) || `https://ui-avatars.com/api/?name=${((_g = auth.user) == null ? void 0 : _g.username) || "U"}&background=0F172A&color=fff`
      };
    });
    const sidebarSections = computed(() => {
      if (isGerantOnly.value) {
        return [
          {
            id: "hotel",
            label: "\xC9tablissement",
            items: [
              { name: "Aper\xE7u", path: "/dashboard/hotel", icon: LayoutDashboard },
              { name: "Mes \xE9tablissements", path: "/dashboard/hotel/hotels", icon: Building2 },
              { name: "R\xE9servations re\xE7ues", path: "/dashboard/hotel/reservations", icon: Calendar },
              { name: "Abonnement", path: "/compte/abonnement", icon: CreditCard },
              { name: "Historique paiements", path: "/compte/paiements", icon: Receipt }
            ]
          }
        ];
      }
      const overview = auth.isAdmin ? [
        { name: "Accueil", path: "/dashboard", icon: Home },
        { name: "Statistiques", path: "/dashboard/statistiques", icon: BarChart3 }
      ] : [
        { name: "Accueil", path: "/dashboard", icon: Home },
        { name: "Mes r\xE9servations", path: "/dashboard/my-reservations", icon: Calendar },
        { name: "Mes sollicitations", path: "/dashboard/my-solicitations", icon: Wrench },
        { name: "Certification", path: "/dashboard/certification", icon: ShieldCheck },
        { name: "Abonnement", path: "/compte/abonnement", icon: CreditCard },
        { name: "Historique paiements", path: "/compte/paiements", icon: Receipt }
      ];
      return [
        { id: "main", label: "Tableau de bord", items: overview },
        {
          id: "pubs",
          label: "Publications",
          items: [
            { name: "Propri\xE9t\xE9s", path: "/dashboard/publications?tab=properties", icon: Briefcase },
            { name: "Services", path: "/dashboard/publications?tab=services", icon: Settings },
            { name: "Tourisme & agences", path: "/dashboard/agences", icon: MapPin },
            { name: "H\xF4tels", path: "/dashboard/publications?tab=hotels", icon: Building2 }
          ]
        },
        {
          id: "admin",
          label: "Administration",
          items: [
            { name: "Utilisateurs", path: "/dashboard/users", icon: Users },
            { name: "Paiements", path: "/dashboard/payments", icon: Receipt },
            { name: "Param\xE8tres", path: "/compte/profile", icon: Settings }
          ]
        }
      ];
    });
    onClickOutside(userMenuRef, () => {
      isUserMenuOpen.value = false;
    });
    async function goTo(event, path) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      isMobileMenuOpen.value = false;
      const qIndex = path.indexOf("?");
      const pathname = qIndex === -1 ? path : path.slice(0, qIndex);
      const query = {};
      if (qIndex !== -1) {
        new URLSearchParams(path.slice(qIndex + 1)).forEach((value, key) => {
          query[key] = value;
        });
      }
      try {
        await navigateTo({ path: pathname, query });
      } catch {
        await router.push({ path: pathname, query });
      }
    }
    function isItemActive(path) {
      var _a;
      if (path === "/dashboard" && route.path === "/dashboard") return true;
      if (path.includes("?")) {
        const [p, qs] = path.split("?");
        if (route.path !== p) return false;
        const want = new URLSearchParams(qs);
        for (const [k, v] of want.entries()) {
          if (String((_a = route.query[k]) != null ? _a : "") !== v) return false;
        }
        return true;
      }
      if (path === "/dashboard/hotel") return route.path === "/dashboard/hotel";
      if (path !== "/dashboard" && route.path.startsWith(path)) return true;
      return false;
    }
    const currentTime = ref("");
    const handleLogout = () => {
      auth.logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen bg-background font-sans overflow-hidden" }, _attrs))} data-v-acdfc28e><aside class="${ssrRenderClass([isSidebarCollapsed.value ? "w-[76px]" : "w-[268px]", "hidden md:flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-300 ease-out"])}" data-v-acdfc28e><div class="${ssrRenderClass([isSidebarCollapsed.value ? "justify-center px-2" : "gap-3 px-4", "flex h-20 shrink-0 items-center border-b border-slate-100"])}" data-v-acdfc28e><button type="button" class="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-100" title="Accueil du site" data-v-acdfc28e><img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-7 w-auto" data-v-acdfc28e></button>`);
      if (!isSidebarCollapsed.value) {
        _push(`<div class="min-w-0 flex-1" data-v-acdfc28e><p class="truncate text-sm font-semibold tracking-tight text-slate-900" data-v-acdfc28e>CasaNayo</p><p class="truncate text-[11px] text-slate-500" data-v-acdfc28e>Espace de gestion</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isSidebarCollapsed.value) {
        _push(`<button type="button" class="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700" title="R\xE9duire le menu" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-4" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav class="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4" data-v-acdfc28e><!--[-->`);
      ssrRenderList(sidebarSections.value, (section, index) => {
        _push(`<div data-v-acdfc28e>`);
        if (!isSidebarCollapsed.value) {
          _push(`<p class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400" data-v-acdfc28e>${ssrInterpolate(section.label)}</p>`);
        } else if (index > 0) {
          _push(`<div class="mx-auto mb-2 h-px w-6 bg-slate-200" data-v-acdfc28e></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-0.5" data-v-acdfc28e><!--[-->`);
        ssrRenderList(section.items, (item) => {
          _push(`<a${ssrRenderAttr("href", item.path)}${ssrRenderAttr("title", isSidebarCollapsed.value ? item.name : void 0)}${ssrRenderAttr("aria-current", isItemActive(item.path) ? "page" : void 0)} class="${ssrRenderClass([[
            isSidebarCollapsed.value ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
            isItemActive(item.path) ? "bg-[#e8f3fb] text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          ], "relative flex items-center rounded-lg text-[13px] font-medium transition-colors"])}" data-v-acdfc28e>`);
          if (isItemActive(item.path) && !isSidebarCollapsed.value) {
            _push(`<span class="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#4aa3df]" data-v-acdfc28e></span>`);
          } else {
            _push(`<!---->`);
          }
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
            class: ["size-[18px] shrink-0", isItemActive(item.path) ? "text-[#2f8fc9]" : "text-slate-400"]
          }, null), _parent);
          if (!isSidebarCollapsed.value) {
            _push(`<span class="truncate" data-v-acdfc28e>${ssrInterpolate(item.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</a>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></nav><div class="shrink-0 border-t border-slate-100 p-3" data-v-acdfc28e>`);
      if (isSidebarCollapsed.value) {
        _push(`<button type="button" class="mb-2 grid size-10 w-full place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700" title="D\xE9plier le menu" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-4 rotate-180" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([isSidebarCollapsed.value ? "justify-center" : "", "flex items-center gap-2.5"])}" data-v-acdfc28e><button type="button" class="shrink-0" title="Mon profil" data-v-acdfc28e><img${ssrRenderAttr("src", userProfile.value.avatar)} alt="" class="size-9 rounded-full object-cover ring-2 ring-slate-100" data-v-acdfc28e></button>`);
      if (!isSidebarCollapsed.value) {
        _push(`<div class="min-w-0 flex-1" data-v-acdfc28e><p class="truncate text-[13px] font-semibold text-slate-900" data-v-acdfc28e>${ssrInterpolate(userProfile.value.name)}</p><p class="truncate text-[11px] text-slate-500" data-v-acdfc28e>${ssrInterpolate(userProfile.value.role)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!isSidebarCollapsed.value) {
        _push(`<button type="button" class="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="D\xE9connexion" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></aside><div class="flex-1 flex flex-col min-w-0 bg-muted/20" data-v-acdfc28e><header class="h-20 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all" data-v-acdfc28e><div class="md:hidden flex items-center gap-3" data-v-acdfc28e>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        open: isMobileMenuOpen.value,
        "onUpdate:open": ($event) => isMobileMenuOpen.value = $event
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col h-full" data-v-acdfc28e${_scopeId}><div class="mb-6 flex items-center gap-3" data-v-acdfc28e${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-9 w-auto" data-v-acdfc28e${_scopeId}><div data-v-acdfc28e${_scopeId}><p class="text-sm font-semibold tracking-tight text-slate-900" data-v-acdfc28e${_scopeId}>CasaNayo</p><p class="text-[11px] text-slate-500" data-v-acdfc28e${_scopeId}>Espace de gestion</p></div></div><nav class="flex-1 space-y-6 overflow-y-auto" data-v-acdfc28e${_scopeId}><!--[-->`);
            ssrRenderList(sidebarSections.value, (section) => {
              _push2(`<div data-v-acdfc28e${_scopeId}><p class="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400" data-v-acdfc28e${_scopeId}>${ssrInterpolate(section.label)}</p><div class="space-y-0.5" data-v-acdfc28e${_scopeId}><!--[-->`);
              ssrRenderList(section.items, (item) => {
                _push2(`<a${ssrRenderAttr("href", item.path)}${ssrRenderAttr("aria-current", isItemActive(item.path) ? "page" : void 0)} class="${ssrRenderClass([isItemActive(item.path) ? "bg-[#e8f3fb] text-slate-900" : "text-slate-600 hover:bg-slate-50", "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"])}" data-v-acdfc28e${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                  class: ["size-[18px]", isItemActive(item.path) ? "text-[#2f8fc9]" : "text-slate-400"]
                }, null), _parent2, _scopeId);
                _push2(` ${ssrInterpolate(item.name)}</a>`);
              });
              _push2(`<!--]--></div></div>`);
            });
            _push2(`<!--]--></nav><div class="mt-auto pt-4 border-t border-border" data-v-acdfc28e${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              onClick: handleLogout,
              variant: "ghost",
              class: ["w-full justify-start gap-3 text-muted-foreground h-12 rounded-xl font-bold", isGerantOnly.value ? "hover:text-blue-600 hover:bg-blue-50" : "hover:text-destructive hover:bg-destructive/10"]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(LogOut), { class: "size-5" }, null, _parent3, _scopeId2));
                  _push3(` D\xE9connexion `);
                } else {
                  return [
                    createVNode(unref(LogOut), { class: "size-5" }),
                    createTextVNode(" D\xE9connexion ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col h-full" }, [
                createVNode("div", { class: "mb-6 flex items-center gap-3" }, [
                  createVNode("img", {
                    src: _imports_0,
                    alt: "CasaNayo",
                    class: "h-9 w-auto"
                  }),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold tracking-tight text-slate-900" }, "CasaNayo"),
                    createVNode("p", { class: "text-[11px] text-slate-500" }, "Espace de gestion")
                  ])
                ]),
                createVNode("nav", { class: "flex-1 space-y-6 overflow-y-auto" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(sidebarSections.value, (section) => {
                    return openBlock(), createBlock("div", {
                      key: section.id
                    }, [
                      createVNode("p", { class: "mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400" }, toDisplayString(section.label), 1),
                      createVNode("div", { class: "space-y-0.5" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(section.items, (item) => {
                          return openBlock(), createBlock("a", {
                            key: section.id + item.path + item.name,
                            href: item.path,
                            "aria-current": isItemActive(item.path) ? "page" : void 0,
                            class: ["flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isItemActive(item.path) ? "bg-[#e8f3fb] text-slate-900" : "text-slate-600 hover:bg-slate-50"],
                            onClick: ($event) => goTo($event, item.path)
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                              class: ["size-[18px]", isItemActive(item.path) ? "text-[#2f8fc9]" : "text-slate-400"]
                            }, null, 8, ["class"])),
                            createTextVNode(" " + toDisplayString(item.name), 1)
                          ], 10, ["href", "aria-current", "onClick"]);
                        }), 128))
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "mt-auto pt-4 border-t border-border" }, [
                  createVNode(unref(_sfc_main$2), {
                    onClick: handleLogout,
                    variant: "ghost",
                    class: ["w-full justify-start gap-3 text-muted-foreground h-12 rounded-xl font-bold", isGerantOnly.value ? "hover:text-blue-600 hover:bg-blue-50" : "hover:text-destructive hover:bg-destructive/10"]
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(LogOut), { class: "size-5" }),
                      createTextVNode(" D\xE9connexion ")
                    ]),
                    _: 1
                  }, 8, ["class"])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              variant: "ghost",
              size: "icon",
              onClick: ($event) => isMobileMenuOpen.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Menu), { class: "size-6 text-muted-foreground" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Menu), { class: "size-6 text-muted-foreground" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), {
                variant: "ghost",
                size: "icon",
                onClick: ($event) => isMobileMenuOpen.value = true
              }, {
                default: withCtx(() => [
                  createVNode(unref(Menu), { class: "size-6 text-muted-foreground" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="font-bold text-lg" data-v-acdfc28e>CasaNayo</span></div><div class="hidden md:flex items-center gap-4 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50" data-v-acdfc28e>`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-muted-foreground/70" data-v-acdfc28e></div><div class="flex items-center gap-6 ml-auto" data-v-acdfc28e><div class="hidden lg:flex flex-col items-end mr-2" data-v-acdfc28e><span class="text-2xl font-black text-foreground leading-none tracking-tight" data-v-acdfc28e>${ssrInterpolate(currentTime.value)}</span><span class="text-[10px] font-bold text-primary uppercase tracking-widest" data-v-acdfc28e>${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { weekday: "long", month: "long", day: "numeric" }))}</span></div><div class="h-8 w-[1px] bg-border hidden lg:block" data-v-acdfc28e></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "ghost",
        size: "icon",
        class: "relative rounded-full hover:bg-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bell), { class: "size-5 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(`<span class="${ssrRenderClass([isGerantOnly.value ? "bg-blue-500" : "bg-red-500", "absolute top-2 right-2 size-2 rounded-full border-2 border-card"])}" data-v-acdfc28e${_scopeId}></span>`);
          } else {
            return [
              createVNode(unref(Bell), { class: "size-5 text-muted-foreground" }),
              createVNode("span", {
                class: ["absolute top-2 right-2 size-2 rounded-full border-2 border-card", isGerantOnly.value ? "bg-blue-500" : "bg-red-500"]
              }, null, 2)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative" data-v-acdfc28e><div class="flex items-center gap-3 pl-2 group cursor-pointer" data-v-acdfc28e><div class="flex flex-col items-end md:flex" data-v-acdfc28e><span class="text-sm font-bold text-foreground group-hover:text-primary transition-colors text-right" data-v-acdfc28e>${ssrInterpolate(userProfile.value.name)}</span><span class="text-[10px] font-medium text-muted-foreground" data-v-acdfc28e>${ssrInterpolate(userProfile.value.role)}</span></div><div class="size-10 rounded-full bg-primary/20 p-1 ring-2 ring-primary/20 ring-offset-2 ring-offset-card transition-all group-hover:ring-primary/50 overflow-hidden" data-v-acdfc28e><img${ssrRenderAttr("src", userProfile.value.avatar)} alt="Avatar" class="h-full w-full rounded-full object-cover" data-v-acdfc28e></div></div>`);
      if (isUserMenuOpen.value) {
        _push(`<div class="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2" data-v-acdfc28e><button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent));
        _push(` Mon profil </button><div class="h-[1px] bg-border my-1" data-v-acdfc28e></div><button class="${ssrRenderClass([isGerantOnly.value ? "text-blue-600 hover:bg-blue-50" : "text-red-500 hover:bg-red-50", "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors"])}" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
        _push(` Se d\xE9connecter </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" data-v-acdfc28e><div class="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" data-v-acdfc28e>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
      if (showLogoutModal.value) {
        _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" data-v-acdfc28e><div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300" data-v-acdfc28e><div class="p-12 text-center" data-v-acdfc28e><div class="relative size-24 mx-auto mb-10" data-v-acdfc28e><div class="${ssrRenderClass([isGerantOnly.value ? "bg-blue-500/20" : "bg-red-500/20", "absolute inset-0 rounded-full animate-ping"])}" data-v-acdfc28e></div><div class="${ssrRenderClass([isGerantOnly.value ? "bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/40" : "bg-gradient-to-tr from-red-600 to-red-400 shadow-red-500/40", "relative size-full rounded-full flex items-center justify-center shadow-2xl"])}" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(AlertOctagon), { class: "size-12 text-white" }, null, _parent));
        _push(`</div></div><h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2" data-v-acdfc28e>Voulez-vous vous d\xE9connecter ?</h3><p class="text-muted-foreground text-sm mb-8" data-v-acdfc28e> Vous devrez vous reconnecter pour acc\xE9der \xE0 votre compte. </p><div class="grid grid-cols-2 gap-4" data-v-acdfc28e>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          onClick: ($event) => showLogoutModal.value = false,
          class: "h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Rester `);
            } else {
              return [
                createTextVNode(" Rester ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: handleLogout,
          class: ["h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 text-white", isGerantOnly.value ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25" : "bg-red-600 hover:bg-red-700 shadow-red-600/20"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` D\xE9connexion `);
            } else {
              return [
                createTextVNode(" D\xE9connexion ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-acdfc28e"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-DxSUluje.mjs.map
