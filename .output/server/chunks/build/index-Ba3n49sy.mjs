import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createVNode, Fragment, withModifiers, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { RotateCcw, Loader2, UserCheck, ShieldCheck, Check, ShieldAlert, Search, Mail, Phone, MapPin, UserMinus, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$3 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Badge-CZaU8sYj.mjs';
import { _ as _sfc_main$5, a as _sfc_main$4, b as _sfc_main$2$1, c as _sfc_main$1$1, d as _sfc_main$3$1, e as _sfc_main$6 } from './TableCell-aM2uE8ea.mjs';
import { l as useAuthStore, s as useMembersStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { useRouter } from 'vue-router';
import { t as toast } from './index-DJGQOf1Z.mjs';
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
import '@tanstack/vue-query';

const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const auth = useAuthStore();
    const membersStore = useMembersStore();
    const config = useRuntimeConfig();
    const users = computed(() => membersStore.users);
    const isLoading = ref(true);
    const isUpdating = ref(null);
    const searchQuery = ref("");
    const filterCertification = ref("all");
    const filterPremium = ref("all");
    const showAdmins = ref(false);
    const currentPage = ref(1);
    const fetchUsers = async () => {
      isLoading.value = true;
      membersStore.setLoading(true);
      try {
        const apiBase = config.public.apiBase;
        const authH = { Authorization: `Bearer ${auth.token}` };
        const [usersRes, membersRes, cardsRes] = await Promise.all([
          $fetch(joinApi(apiBase, ApiEndpoints.allUsers), { headers: authH }),
          $fetch(joinApi(apiBase, ApiEndpoints.protectedMembers), { headers: authH }),
          $fetch(joinApi(apiBase, ApiEndpoints.cards), { headers: authH })
        ]);
        if (usersRes && usersRes.data) {
          membersStore.setUsers(usersRes.data);
        } else if (Array.isArray(usersRes)) {
          membersStore.setUsers(usersRes);
        }
        if (membersRes && membersRes.data) {
          membersStore.setMembers(membersRes.data);
        } else if (Array.isArray(membersRes)) {
          membersStore.setMembers(membersRes);
        }
        if (cardsRes && cardsRes.data) {
          membersStore.setCardTypes(cardsRes.data);
        } else if (Array.isArray(cardsRes)) {
          membersStore.setCardTypes(cardsRes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des donn\xE9es");
      } finally {
        isLoading.value = false;
        membersStore.setLoading(false);
      }
    };
    const toggleCertification = async (user) => {
      isUpdating.value = user.userId;
      const newStatus = !user.certified;
      const result = await membersStore.certifyUser(user.userId, newStatus);
      if (result.success) {
        toast.success(newStatus ? "Utilisateur certifi\xE9 avec succ\xE8s" : "Certification retir\xE9e");
      } else {
        toast.error("Erreur lors de la modification du statut");
      }
      isUpdating.value = null;
    };
    const checkIsAdmin = (userId) => {
      const member = membersStore.getMemberByUserId(userId);
      if (!member || !member.accounts) return false;
      return member.accounts.some((acc) => acc.id === 18 || acc.id === 19);
    };
    const filteredUsers = computed(() => {
      let list = [...users.value];
      list.sort((a, b) => b.userId - a.userId);
      if (showAdmins.value) {
        list = list.filter((u) => checkIsAdmin(u.userId));
      } else {
        list = list.filter((u) => !checkIsAdmin(u.userId));
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(
          (user) => {
            var _a, _b, _c, _d;
            return ((_a = user.username) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = user.email) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_c = user.phone) == null ? void 0 : _c.toLowerCase().includes(query)) || ((_d = user.city) == null ? void 0 : _d.toLowerCase().includes(query));
          }
        );
      }
      if (filterCertification.value === "certified") {
        list = list.filter((u) => u.certified);
      } else if (filterCertification.value === "uncertified") {
        list = list.filter((u) => !u.certified);
      }
      if (filterPremium.value === "premium") {
        list = list.filter((u) => u.premium);
      } else if (filterPremium.value === "free") {
        list = list.filter((u) => !u.premium);
      }
      return list;
    });
    const stats = computed(() => {
      const allUsers = users.value;
      const adminUsers = allUsers.filter((u) => checkIsAdmin(u.userId));
      const regularUsers = allUsers.filter((u) => !checkIsAdmin(u.userId));
      return {
        total: regularUsers.length,
        admins: adminUsers.length,
        certified: regularUsers.filter((u) => u.certified).length,
        uncertified: regularUsers.filter((u) => !u.certified).length,
        premium: regularUsers.filter((u) => u.premium).length
      };
    });
    watch([searchQuery, filterCertification, filterPremium, showAdmins], () => {
      currentPage.value = 1;
    });
    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredUsers.value.slice(start, end);
    });
    const resetFilters = () => {
      searchQuery.value = "";
      filterCertification.value = "all";
      filterPremium.value = "all";
      showAdmins.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><h2 class="text-3xl font-black tracking-tight flex items-center gap-3"> Utilisateurs `);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        class: "font-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(stats.value.total)}`);
          } else {
            return [
              createTextVNode(toDisplayString(stats.value.total), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2><p class="text-muted-foreground mt-1 text-sm lg:text-base">G\xE9rez les certifications et analysez votre base d&#39;utilisateurs.</p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        onClick: fetchUsers,
        disabled: isLoading.value,
        class: "shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!isLoading.value) {
              _push2(ssrRenderComponent(unref(RotateCcw), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            }
            _push2(` Actualiser `);
          } else {
            return [
              !isLoading.value ? (openBlock(), createBlock(unref(RotateCcw), {
                key: 0,
                class: "mr-2 h-4 w-4"
              })) : (openBlock(), createBlock(unref(Loader2), {
                key: 1,
                class: "mr-2 h-4 w-4 animate-spin"
              })),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"><div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4"><div class="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">`);
      _push(ssrRenderComponent(unref(UserCheck), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Utilisateurs</p><p class="text-2xl font-black">${ssrInterpolate(stats.value.total)}</p></div></div><div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4 border-primary/20 bg-primary/[0.02]"><div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-primary">Admins</p><p class="text-2xl font-black text-primary">${ssrInterpolate(stats.value.admins)}</p></div></div><div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4"><div class="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">`);
      _push(ssrRenderComponent(unref(Check), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Certifi\xE9s</p><p class="text-2xl font-black">${ssrInterpolate(stats.value.certified)}</p></div></div><div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4"><div class="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">`);
      _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-red-500">Non Certifi\xE9s</p><p class="text-2xl font-black text-red-600">${ssrInterpolate(stats.value.uncertified)}</p></div></div><div class="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4"><div class="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        class: "border-amber-200 text-amber-700 bg-amber-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`VIP`);
          } else {
            return [
              createTextVNode("VIP")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Premium</p><p class="text-2xl font-black">${ssrInterpolate(stats.value.premium)}</p></div></div></div><div class="bg-card p-4 rounded-xl border shadow-sm space-y-4"><div class="flex flex-col md:flex-row gap-4"><div class="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border self-start">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "ghost",
        size: "sm",
        class: [!showAdmins.value ? "bg-white shadow-sm text-primary font-bold" : "", "rounded-lg px-4"],
        onClick: ($event) => showAdmins.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Utilisateurs `);
          } else {
            return [
              createTextVNode(" Utilisateurs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "ghost",
        size: "sm",
        class: [showAdmins.value ? "bg-primary text-white shadow-md font-bold" : "", "rounded-lg px-4"],
        onClick: ($event) => showAdmins.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (showAdmins.value) {
              _push2(ssrRenderComponent(unref(ShieldCheck), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` Staff / Admins `);
          } else {
            return [
              showAdmins.value ? (openBlock(), createBlock(unref(ShieldCheck), {
                key: 0,
                class: "h-4 w-4 mr-2"
              })) : createCommentVNode("", true),
              createTextVNode(" Staff / Admins ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative flex-1">`);
      _push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        placeholder: "Nom, email, t\xE9l\xE9phone ou ville...",
        class: "pl-9 h-11 border-muted bg-muted/20 focus:bg-background transition-all"
      }, null, _parent));
      _push(`</div><div class="flex items-center gap-3"><select class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" style="${ssrRenderStyle(!showAdmins.value ? null : { display: "none" })}"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filterCertification.value) ? ssrLooseContain(filterCertification.value, "all") : ssrLooseEqual(filterCertification.value, "all")) ? " selected" : ""}>Tous les statuts</option><option value="certified"${ssrIncludeBooleanAttr(Array.isArray(filterCertification.value) ? ssrLooseContain(filterCertification.value, "certified") : ssrLooseEqual(filterCertification.value, "certified")) ? " selected" : ""}>Certifi\xE9s seulement</option><option value="uncertified"${ssrIncludeBooleanAttr(Array.isArray(filterCertification.value) ? ssrLooseContain(filterCertification.value, "uncertified") : ssrLooseEqual(filterCertification.value, "uncertified")) ? " selected" : ""}>Non certifi\xE9s</option></select><select class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" style="${ssrRenderStyle(!showAdmins.value ? null : { display: "none" })}"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filterPremium.value) ? ssrLooseContain(filterPremium.value, "all") : ssrLooseEqual(filterPremium.value, "all")) ? " selected" : ""}>Tout abonnement</option><option value="premium"${ssrIncludeBooleanAttr(Array.isArray(filterPremium.value) ? ssrLooseContain(filterPremium.value, "premium") : ssrLooseEqual(filterPremium.value, "premium")) ? " selected" : ""}>Membres Premium</option><option value="free"${ssrIncludeBooleanAttr(Array.isArray(filterPremium.value) ? ssrLooseContain(filterPremium.value, "free") : ssrLooseEqual(filterPremium.value, "free")) ? " selected" : ""}>Membres Gratuits</option></select>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "ghost",
        size: "icon",
        onClick: resetFilters,
        title: "R\xE9initialiser"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RotateCcw), { class: "h-4 w-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(RotateCcw), { class: "h-4 w-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="rounded-xl border bg-card shadow-sm overflow-hidden">`);
      _push(ssrRenderComponent(unref(_sfc_main$5), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "bg-muted/50" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$2$1), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`ID`);
                            } else {
                              return [
                                createTextVNode("ID")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Utilisateur`);
                            } else {
                              return [
                                createTextVNode("Utilisateur")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Contact`);
                            } else {
                              return [
                                createTextVNode("Contact")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Localisation`);
                            } else {
                              return [
                                createTextVNode("Localisation")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Statut`);
                            } else {
                              return [
                                createTextVNode("Statut")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Premium`);
                            } else {
                              return [
                                createTextVNode("Premium")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), { class: "text-right" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Actions`);
                            } else {
                              return [
                                createTextVNode("Actions")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                            default: withCtx(() => [
                              createTextVNode("ID")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Utilisateur")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Contact")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Localisation")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Statut")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Premium")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), { class: "text-right" }, {
                            default: withCtx(() => [
                              createTextVNode("Actions")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$2$1), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                          default: withCtx(() => [
                            createTextVNode("ID")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Utilisateur")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Contact")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Localisation")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Statut")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Premium")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), { class: "text-right" }, {
                          default: withCtx(() => [
                            createTextVNode("Actions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (isLoading.value) {
                    _push3(`<tr${_scopeId2}><td colspan="7" class="h-64 text-center"${_scopeId2}><div class="flex flex-col items-center justify-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Loader2), { class: "h-10 w-10 animate-spin text-primary" }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-sm text-muted-foreground font-medium italic"${_scopeId2}>Synchronisation avec le serveur...</span></div></td></tr>`);
                  } else {
                    _push3(`<!--[--><!--[-->`);
                    ssrRenderList(paginatedUsers.value, (user) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        key: user.userId,
                        class: "hover:bg-muted/30 transition-colors group cursor-pointer",
                        onClick: ($event) => unref(router).push(`/dashboard/users/${user.userId}`)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "font-mono text-[10px] text-muted-foreground" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`#${ssrInterpolate(user.userId)}`);
                                } else {
                                  return [
                                    createTextVNode("#" + toDisplayString(user.userId), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a, _b;
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-3"${_scopeId4}><div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden"${_scopeId4}>`);
                                  if (user.certified && stats.value.premium) {
                                    _push5(`<img${ssrRenderAttr("src", `https://ui-avatars.com/api/?name=${user.username}&background=random`)} class="h-full w-full object-cover opacity-50"${_scopeId4}>`);
                                  } else {
                                    _push5(`<span${_scopeId4}>${ssrInterpolate((_a = user.username) == null ? void 0 : _a.substring(0, 2).toUpperCase().replace("@", ""))}</span>`);
                                  }
                                  _push5(`</div><span class="font-bold text-foreground"${_scopeId4}>${ssrInterpolate(user.username)}</span></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-3" }, [
                                      createVNode("div", { class: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden" }, [
                                        user.certified && stats.value.premium ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                                          class: "h-full w-full object-cover opacity-50"
                                        }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((_b = user.username) == null ? void 0 : _b.substring(0, 2).toUpperCase().replace("@", "")), 1))
                                      ]),
                                      createVNode("span", { class: "font-bold text-foreground" }, toDisplayString(user.username), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex flex-col space-y-1"${_scopeId4}><div class="flex items-center gap-2 text-xs text-muted-foreground"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(Mail), { class: "h-3 w-3" }, null, _parent5, _scopeId4));
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(user.email || "\u2014")}</span></div><div class="flex items-center gap-2 text-xs text-muted-foreground"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(Phone), { class: "h-3 w-3" }, null, _parent5, _scopeId4));
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(user.phone && user.phone !== "null" ? user.phone : "\u2014")}</span></div></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex flex-col space-y-1" }, [
                                      createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                        createVNode(unref(Mail), { class: "h-3 w-3" }),
                                        createVNode("span", null, toDisplayString(user.email || "\u2014"), 1)
                                      ]),
                                      createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                        createVNode(unref(Phone), { class: "h-3 w-3" }),
                                        createVNode("span", null, toDisplayString(user.phone && user.phone !== "null" ? user.phone : "\u2014"), 1)
                                      ])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (user.city || user.country) {
                                    _push5(`<div class="flex items-center gap-1.5 text-xs"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5 text-blue-500/70" }, null, _parent5, _scopeId4));
                                    _push5(`<span${_scopeId4}>${ssrInterpolate(user.city)}${ssrInterpolate(user.city && user.country ? ", " : "")}${ssrInterpolate(user.country)}</span></div>`);
                                  } else {
                                    _push5(`<span class="text-xs text-muted-foreground italic"${_scopeId4}>Inconnue</span>`);
                                  }
                                } else {
                                  return [
                                    user.city || user.country ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center gap-1.5 text-xs"
                                    }, [
                                      createVNode(unref(MapPin), { class: "h-3.5 w-3.5 text-blue-500/70" }),
                                      createVNode("span", null, toDisplayString(user.city) + toDisplayString(user.city && user.country ? ", " : "") + toDisplayString(user.country), 1)
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-xs text-muted-foreground italic"
                                    }, "Inconnue"))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a, _b, _c, _d;
                                if (_push5) {
                                  if (checkIsAdmin(user.userId)) {
                                    _push5(`<!--[-->`);
                                    if ((_b = (_a = unref(membersStore).getMemberByUserId(user.userId)) == null ? void 0 : _a.accounts) == null ? void 0 : _b.some((a) => a.id === 19)) {
                                      _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                        variant: "default",
                                        class: "bg-purple-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(` Superadmin `);
                                          } else {
                                            return [
                                              createTextVNode(" Superadmin ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                        variant: "default",
                                        class: "bg-indigo-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(` Admin `);
                                          } else {
                                            return [
                                              createTextVNode(" Admin ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    }
                                    _push5(`<!--]-->`);
                                  } else {
                                    _push5(`<!--[-->`);
                                    if (user.certified) {
                                      _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                        variant: "default",
                                        class: "bg-green-600 hover:bg-green-700 shadow-sm border-none"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(unref(UserCheck), { class: "h-3 w-3 mr-1" }, null, _parent6, _scopeId5));
                                            _push6(` Certifi\xE9 `);
                                          } else {
                                            return [
                                              createVNode(unref(UserCheck), { class: "h-3 w-3 mr-1" }),
                                              createTextVNode(" Certifi\xE9 ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                        variant: "destructive",
                                        class: "bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(unref(UserMinus), { class: "h-3 w-3 mr-1" }, null, _parent6, _scopeId5));
                                            _push6(` Non certifi\xE9 `);
                                          } else {
                                            return [
                                              createVNode(unref(UserMinus), { class: "h-3 w-3 mr-1" }),
                                              createTextVNode(" Non certifi\xE9 ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    }
                                    _push5(`<!--]-->`);
                                  }
                                } else {
                                  return [
                                    checkIsAdmin(user.userId) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      ((_d = (_c = unref(membersStore).getMemberByUserId(user.userId)) == null ? void 0 : _c.accounts) == null ? void 0 : _d.some((a) => a.id === 19)) ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        variant: "default",
                                        class: "bg-purple-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Superadmin ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 1,
                                        variant: "default",
                                        class: "bg-indigo-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Admin ")
                                        ]),
                                        _: 1
                                      }))
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      user.certified ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        variant: "default",
                                        class: "bg-green-600 hover:bg-green-700 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UserCheck), { class: "h-3 w-3 mr-1" }),
                                          createTextVNode(" Certifi\xE9 ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 1,
                                        variant: "destructive",
                                        class: "bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UserMinus), { class: "h-3 w-3 mr-1" }),
                                          createTextVNode(" Non certifi\xE9 ")
                                        ]),
                                        _: 1
                                      }))
                                    ], 64))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex"${_scopeId4}>`);
                                  if (checkIsAdmin(user.userId)) {
                                    _push5(`<span class="text-[10px] font-bold text-muted-foreground uppercase"${_scopeId4}>Staff CasaNayo</span>`);
                                  } else {
                                    _push5(`<!--[-->`);
                                    if (user.premium) {
                                      _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                        variant: "default",
                                        class: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }, null, _parent6, _scopeId5));
                                            _push6(` PREMIUM `);
                                          } else {
                                            return [
                                              createVNode(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }),
                                              createTextVNode(" PREMIUM ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<span class="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40"${_scopeId4}>Gratuit</span>`);
                                    }
                                    _push5(`<!--]-->`);
                                  }
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex" }, [
                                      checkIsAdmin(user.userId) ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "text-[10px] font-bold text-muted-foreground uppercase"
                                      }, "Staff CasaNayo")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        user.premium ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                          key: 0,
                                          variant: "default",
                                          class: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }),
                                            createTextVNode(" PREMIUM ")
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock("span", {
                                          key: 1,
                                          class: "text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40"
                                        }, "Gratuit"))
                                      ], 64))
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "text-right px-4" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (checkIsAdmin(user.userId)) {
                                    _push5(ssrRenderComponent(unref(_sfc_main$2), {
                                      variant: "secondary",
                                      size: "sm",
                                      class: "h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2",
                                      onClick: ($event) => unref(toast).info("Gestion des r\xF4les bient\xF4t disponible")
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(ShieldCheck), { class: "h-4 w-4" }, null, _parent6, _scopeId5));
                                          _push6(` Editer R\xF4le `);
                                        } else {
                                          return [
                                            createVNode(unref(ShieldCheck), { class: "h-4 w-4" }),
                                            createTextVNode(" Editer R\xF4le ")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    _push5(ssrRenderComponent(unref(_sfc_main$2), {
                                      variant: "outline",
                                      size: "sm",
                                      disabled: isUpdating.value === user.userId,
                                      onClick: ($event) => toggleCertification(user),
                                      class: `${user.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-9 w-full lg:w-32 transition-all font-bold`
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          if (isUpdating.value === user.userId) {
                                            _push6(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin mr-2" }, null, _parent6, _scopeId5));
                                          } else {
                                            _push6(`<!--[-->${ssrInterpolate(user.certified ? "D\xE9-certifier" : "Certifier")}<!--]-->`);
                                          }
                                        } else {
                                          return [
                                            isUpdating.value === user.userId ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "h-4 w-4 animate-spin mr-2"
                                            })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                              createTextVNode(toDisplayString(user.certified ? "D\xE9-certifier" : "Certifier"), 1)
                                            ], 64))
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  }
                                } else {
                                  return [
                                    checkIsAdmin(user.userId) ? (openBlock(), createBlock(unref(_sfc_main$2), {
                                      key: 0,
                                      variant: "secondary",
                                      size: "sm",
                                      class: "h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2",
                                      onClick: withModifiers(($event) => unref(toast).info("Gestion des r\xF4les bient\xF4t disponible"), ["stop"])
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ShieldCheck), { class: "h-4 w-4" }),
                                        createTextVNode(" Editer R\xF4le ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$2), {
                                      key: 1,
                                      variant: "outline",
                                      size: "sm",
                                      disabled: isUpdating.value === user.userId,
                                      onClick: withModifiers(($event) => toggleCertification(user), ["stop"]),
                                      class: `${user.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-9 w-full lg:w-32 transition-all font-bold`
                                    }, {
                                      default: withCtx(() => [
                                        isUpdating.value === user.userId ? (openBlock(), createBlock(unref(Loader2), {
                                          key: 0,
                                          class: "h-4 w-4 animate-spin mr-2"
                                        })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createTextVNode(toDisplayString(user.certified ? "D\xE9-certifier" : "Certifier"), 1)
                                        ], 64))
                                      ]),
                                      _: 2
                                    }, 1032, ["disabled", "onClick", "class"]))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$6), { class: "font-mono text-[10px] text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode("#" + toDisplayString(user.userId), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createVNode("div", { class: "flex items-center gap-3" }, [
                                      createVNode("div", { class: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden" }, [
                                        user.certified && stats.value.premium ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                                          class: "h-full w-full object-cover opacity-50"
                                        }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((_a = user.username) == null ? void 0 : _a.substring(0, 2).toUpperCase().replace("@", "")), 1))
                                      ]),
                                      createVNode("span", { class: "font-bold text-foreground" }, toDisplayString(user.username), 1)
                                    ])
                                  ];
                                }),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex flex-col space-y-1" }, [
                                    createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                      createVNode(unref(Mail), { class: "h-3 w-3" }),
                                      createVNode("span", null, toDisplayString(user.email || "\u2014"), 1)
                                    ]),
                                    createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                      createVNode(unref(Phone), { class: "h-3 w-3" }),
                                      createVNode("span", null, toDisplayString(user.phone && user.phone !== "null" ? user.phone : "\u2014"), 1)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  user.city || user.country ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center gap-1.5 text-xs"
                                  }, [
                                    createVNode(unref(MapPin), { class: "h-3.5 w-3.5 text-blue-500/70" }),
                                    createVNode("span", null, toDisplayString(user.city) + toDisplayString(user.city && user.country ? ", " : "") + toDisplayString(user.country), 1)
                                  ])) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-xs text-muted-foreground italic"
                                  }, "Inconnue"))
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => {
                                  var _a, _b;
                                  return [
                                    checkIsAdmin(user.userId) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      ((_b = (_a = unref(membersStore).getMemberByUserId(user.userId)) == null ? void 0 : _a.accounts) == null ? void 0 : _b.some((a) => a.id === 19)) ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        variant: "default",
                                        class: "bg-purple-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Superadmin ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 1,
                                        variant: "default",
                                        class: "bg-indigo-600 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Admin ")
                                        ]),
                                        _: 1
                                      }))
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      user.certified ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        variant: "default",
                                        class: "bg-green-600 hover:bg-green-700 shadow-sm border-none"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UserCheck), { class: "h-3 w-3 mr-1" }),
                                          createTextVNode(" Certifi\xE9 ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 1,
                                        variant: "destructive",
                                        class: "bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(UserMinus), { class: "h-3 w-3 mr-1" }),
                                          createTextVNode(" Non certifi\xE9 ")
                                        ]),
                                        _: 1
                                      }))
                                    ], 64))
                                  ];
                                }),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex" }, [
                                    checkIsAdmin(user.userId) ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "text-[10px] font-bold text-muted-foreground uppercase"
                                    }, "Staff CasaNayo")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      user.premium ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        variant: "default",
                                        class: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }),
                                          createTextVNode(" PREMIUM ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40"
                                      }, "Gratuit"))
                                    ], 64))
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "text-right px-4" }, {
                                default: withCtx(() => [
                                  checkIsAdmin(user.userId) ? (openBlock(), createBlock(unref(_sfc_main$2), {
                                    key: 0,
                                    variant: "secondary",
                                    size: "sm",
                                    class: "h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2",
                                    onClick: withModifiers(($event) => unref(toast).info("Gestion des r\xF4les bient\xF4t disponible"), ["stop"])
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ShieldCheck), { class: "h-4 w-4" }),
                                      createTextVNode(" Editer R\xF4le ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$2), {
                                    key: 1,
                                    variant: "outline",
                                    size: "sm",
                                    disabled: isUpdating.value === user.userId,
                                    onClick: withModifiers(($event) => toggleCertification(user), ["stop"]),
                                    class: `${user.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-9 w-full lg:w-32 transition-all font-bold`
                                  }, {
                                    default: withCtx(() => [
                                      isUpdating.value === user.userId ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "h-4 w-4 animate-spin mr-2"
                                      })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        createTextVNode(toDisplayString(user.certified ? "D\xE9-certifier" : "Certifier"), 1)
                                      ], 64))
                                    ]),
                                    _: 2
                                  }, 1032, ["disabled", "onClick", "class"]))
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                    if (filteredUsers.value.length === 0) {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$6), {
                              colspan: "7",
                              class: "h-64 text-center"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex flex-col items-center justify-center gap-3"${_scopeId4}><div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(Search), { class: "h-10 w-10 text-muted-foreground/30" }, null, _parent5, _scopeId4));
                                  _push5(`</div><div class="space-y-1"${_scopeId4}><p class="text-foreground font-black text-xl"${_scopeId4}>Aucun utilisateur trouv\xE9</p><p class="text-muted-foreground text-sm"${_scopeId4}>Ajustez vos filtres ou effectuez une nouvelle recherche.</p></div>`);
                                  _push5(ssrRenderComponent(unref(_sfc_main$2), {
                                    variant: "secondary",
                                    onClick: resetFilters,
                                    class: "mt-4"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(` R\xE9initialiser tout `);
                                      } else {
                                        return [
                                          createTextVNode(" R\xE9initialiser tout ")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex flex-col items-center justify-center gap-3" }, [
                                      createVNode("div", { class: "h-20 w-20 rounded-full bg-muted flex items-center justify-center" }, [
                                        createVNode(unref(Search), { class: "h-10 w-10 text-muted-foreground/30" })
                                      ]),
                                      createVNode("div", { class: "space-y-1" }, [
                                        createVNode("p", { class: "text-foreground font-black text-xl" }, "Aucun utilisateur trouv\xE9"),
                                        createVNode("p", { class: "text-muted-foreground text-sm" }, "Ajustez vos filtres ou effectuez une nouvelle recherche.")
                                      ]),
                                      createVNode(unref(_sfc_main$2), {
                                        variant: "secondary",
                                        onClick: resetFilters,
                                        class: "mt-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" R\xE9initialiser tout ")
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$6), {
                                colspan: "7",
                                class: "h-64 text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex flex-col items-center justify-center gap-3" }, [
                                    createVNode("div", { class: "h-20 w-20 rounded-full bg-muted flex items-center justify-center" }, [
                                      createVNode(unref(Search), { class: "h-10 w-10 text-muted-foreground/30" })
                                    ]),
                                    createVNode("div", { class: "space-y-1" }, [
                                      createVNode("p", { class: "text-foreground font-black text-xl" }, "Aucun utilisateur trouv\xE9"),
                                      createVNode("p", { class: "text-muted-foreground text-sm" }, "Ajustez vos filtres ou effectuez une nouvelle recherche.")
                                    ]),
                                    createVNode(unref(_sfc_main$2), {
                                      variant: "secondary",
                                      onClick: resetFilters,
                                      class: "mt-4"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" R\xE9initialiser tout ")
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  }
                } else {
                  return [
                    isLoading.value ? (openBlock(), createBlock("tr", { key: 0 }, [
                      createVNode("td", {
                        colspan: "7",
                        class: "h-64 text-center"
                      }, [
                        createVNode("div", { class: "flex flex-col items-center justify-center gap-2" }, [
                          createVNode(unref(Loader2), { class: "h-10 w-10 animate-spin text-primary" }),
                          createVNode("span", { class: "text-sm text-muted-foreground font-medium italic" }, "Synchronisation avec le serveur...")
                        ])
                      ])
                    ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginatedUsers.value, (user) => {
                        return openBlock(), createBlock(unref(_sfc_main$2$1), {
                          key: user.userId,
                          class: "hover:bg-muted/30 transition-colors group cursor-pointer",
                          onClick: ($event) => unref(router).push(`/dashboard/users/${user.userId}`)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$6), { class: "font-mono text-[10px] text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("#" + toDisplayString(user.userId), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  createVNode("div", { class: "flex items-center gap-3" }, [
                                    createVNode("div", { class: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden" }, [
                                      user.certified && stats.value.premium ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                                        class: "h-full w-full object-cover opacity-50"
                                      }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((_a = user.username) == null ? void 0 : _a.substring(0, 2).toUpperCase().replace("@", "")), 1))
                                    ]),
                                    createVNode("span", { class: "font-bold text-foreground" }, toDisplayString(user.username), 1)
                                  ])
                                ];
                              }),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex flex-col space-y-1" }, [
                                  createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                    createVNode(unref(Mail), { class: "h-3 w-3" }),
                                    createVNode("span", null, toDisplayString(user.email || "\u2014"), 1)
                                  ]),
                                  createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                    createVNode(unref(Phone), { class: "h-3 w-3" }),
                                    createVNode("span", null, toDisplayString(user.phone && user.phone !== "null" ? user.phone : "\u2014"), 1)
                                  ])
                                ])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                user.city || user.country ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex items-center gap-1.5 text-xs"
                                }, [
                                  createVNode(unref(MapPin), { class: "h-3.5 w-3.5 text-blue-500/70" }),
                                  createVNode("span", null, toDisplayString(user.city) + toDisplayString(user.city && user.country ? ", " : "") + toDisplayString(user.country), 1)
                                ])) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-xs text-muted-foreground italic"
                                }, "Inconnue"))
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => {
                                var _a, _b;
                                return [
                                  checkIsAdmin(user.userId) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    ((_b = (_a = unref(membersStore).getMemberByUserId(user.userId)) == null ? void 0 : _a.accounts) == null ? void 0 : _b.some((a) => a.id === 19)) ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 0,
                                      variant: "default",
                                      class: "bg-purple-600 shadow-sm border-none"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Superadmin ")
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 1,
                                      variant: "default",
                                      class: "bg-indigo-600 shadow-sm border-none"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Admin ")
                                      ]),
                                      _: 1
                                    }))
                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    user.certified ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 0,
                                      variant: "default",
                                      class: "bg-green-600 hover:bg-green-700 shadow-sm border-none"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(UserCheck), { class: "h-3 w-3 mr-1" }),
                                        createTextVNode(" Certifi\xE9 ")
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 1,
                                      variant: "destructive",
                                      class: "bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(UserMinus), { class: "h-3 w-3 mr-1" }),
                                        createTextVNode(" Non certifi\xE9 ")
                                      ]),
                                      _: 1
                                    }))
                                  ], 64))
                                ];
                              }),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex" }, [
                                  checkIsAdmin(user.userId) ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-[10px] font-bold text-muted-foreground uppercase"
                                  }, "Staff CasaNayo")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    user.premium ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 0,
                                      variant: "default",
                                      class: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }),
                                        createTextVNode(" PREMIUM ")
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40"
                                    }, "Gratuit"))
                                  ], 64))
                                ])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "text-right px-4" }, {
                              default: withCtx(() => [
                                checkIsAdmin(user.userId) ? (openBlock(), createBlock(unref(_sfc_main$2), {
                                  key: 0,
                                  variant: "secondary",
                                  size: "sm",
                                  class: "h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2",
                                  onClick: withModifiers(($event) => unref(toast).info("Gestion des r\xF4les bient\xF4t disponible"), ["stop"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ShieldCheck), { class: "h-4 w-4" }),
                                    createTextVNode(" Editer R\xF4le ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$2), {
                                  key: 1,
                                  variant: "outline",
                                  size: "sm",
                                  disabled: isUpdating.value === user.userId,
                                  onClick: withModifiers(($event) => toggleCertification(user), ["stop"]),
                                  class: `${user.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-9 w-full lg:w-32 transition-all font-bold`
                                }, {
                                  default: withCtx(() => [
                                    isUpdating.value === user.userId ? (openBlock(), createBlock(unref(Loader2), {
                                      key: 0,
                                      class: "h-4 w-4 animate-spin mr-2"
                                    })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      createTextVNode(toDisplayString(user.certified ? "D\xE9-certifier" : "Certifier"), 1)
                                    ], 64))
                                  ]),
                                  _: 2
                                }, 1032, ["disabled", "onClick", "class"]))
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["onClick"]);
                      }), 128)),
                      filteredUsers.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2$1), { key: 0 }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), {
                            colspan: "7",
                            class: "h-64 text-center"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex flex-col items-center justify-center gap-3" }, [
                                createVNode("div", { class: "h-20 w-20 rounded-full bg-muted flex items-center justify-center" }, [
                                  createVNode(unref(Search), { class: "h-10 w-10 text-muted-foreground/30" })
                                ]),
                                createVNode("div", { class: "space-y-1" }, [
                                  createVNode("p", { class: "text-foreground font-black text-xl" }, "Aucun utilisateur trouv\xE9"),
                                  createVNode("p", { class: "text-muted-foreground text-sm" }, "Ajustez vos filtres ou effectuez une nouvelle recherche.")
                                ]),
                                createVNode(unref(_sfc_main$2), {
                                  variant: "secondary",
                                  onClick: resetFilters,
                                  class: "mt-4"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" R\xE9initialiser tout ")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ], 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$4), { class: "bg-muted/50" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$2$1), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                        default: withCtx(() => [
                          createTextVNode("ID")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), null, {
                        default: withCtx(() => [
                          createTextVNode("Utilisateur")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), null, {
                        default: withCtx(() => [
                          createTextVNode("Contact")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), null, {
                        default: withCtx(() => [
                          createTextVNode("Localisation")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), null, {
                        default: withCtx(() => [
                          createTextVNode("Statut")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), null, {
                        default: withCtx(() => [
                          createTextVNode("Premium")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$1), { class: "text-right" }, {
                        default: withCtx(() => [
                          createTextVNode("Actions")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3$1), null, {
                default: withCtx(() => [
                  isLoading.value ? (openBlock(), createBlock("tr", { key: 0 }, [
                    createVNode("td", {
                      colspan: "7",
                      class: "h-64 text-center"
                    }, [
                      createVNode("div", { class: "flex flex-col items-center justify-center gap-2" }, [
                        createVNode(unref(Loader2), { class: "h-10 w-10 animate-spin text-primary" }),
                        createVNode("span", { class: "text-sm text-muted-foreground font-medium italic" }, "Synchronisation avec le serveur...")
                      ])
                    ])
                  ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginatedUsers.value, (user) => {
                      return openBlock(), createBlock(unref(_sfc_main$2$1), {
                        key: user.userId,
                        class: "hover:bg-muted/30 transition-colors group cursor-pointer",
                        onClick: ($event) => unref(router).push(`/dashboard/users/${user.userId}`)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), { class: "font-mono text-[10px] text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("#" + toDisplayString(user.userId), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createVNode("div", { class: "flex items-center gap-3" }, [
                                  createVNode("div", { class: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden" }, [
                                    user.certified && stats.value.premium ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
                                      class: "h-full w-full object-cover opacity-50"
                                    }, null, 8, ["src"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString((_a = user.username) == null ? void 0 : _a.substring(0, 2).toUpperCase().replace("@", "")), 1))
                                  ]),
                                  createVNode("span", { class: "font-bold text-foreground" }, toDisplayString(user.username), 1)
                                ])
                              ];
                            }),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex flex-col space-y-1" }, [
                                createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                  createVNode(unref(Mail), { class: "h-3 w-3" }),
                                  createVNode("span", null, toDisplayString(user.email || "\u2014"), 1)
                                ]),
                                createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                                  createVNode(unref(Phone), { class: "h-3 w-3" }),
                                  createVNode("span", null, toDisplayString(user.phone && user.phone !== "null" ? user.phone : "\u2014"), 1)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              user.city || user.country ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex items-center gap-1.5 text-xs"
                              }, [
                                createVNode(unref(MapPin), { class: "h-3.5 w-3.5 text-blue-500/70" }),
                                createVNode("span", null, toDisplayString(user.city) + toDisplayString(user.city && user.country ? ", " : "") + toDisplayString(user.country), 1)
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-xs text-muted-foreground italic"
                              }, "Inconnue"))
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => {
                              var _a, _b;
                              return [
                                checkIsAdmin(user.userId) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  ((_b = (_a = unref(membersStore).getMemberByUserId(user.userId)) == null ? void 0 : _a.accounts) == null ? void 0 : _b.some((a) => a.id === 19)) ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 0,
                                    variant: "default",
                                    class: "bg-purple-600 shadow-sm border-none"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Superadmin ")
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 1,
                                    variant: "default",
                                    class: "bg-indigo-600 shadow-sm border-none"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Admin ")
                                    ]),
                                    _: 1
                                  }))
                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  user.certified ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 0,
                                    variant: "default",
                                    class: "bg-green-600 hover:bg-green-700 shadow-sm border-none"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(UserCheck), { class: "h-3 w-3 mr-1" }),
                                      createTextVNode(" Certifi\xE9 ")
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 1,
                                    variant: "destructive",
                                    class: "bg-red-50 hover:bg-red-50 text-red-600 border-red-200 border shadow-none font-medium"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(UserMinus), { class: "h-3 w-3 mr-1" }),
                                      createTextVNode(" Non certifi\xE9 ")
                                    ]),
                                    _: 1
                                  }))
                                ], 64))
                              ];
                            }),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex" }, [
                                checkIsAdmin(user.userId) ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "text-[10px] font-bold text-muted-foreground uppercase"
                                }, "Staff CasaNayo")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  user.premium ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 0,
                                    variant: "default",
                                    class: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 border shadow-none font-black text-[10px]"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ShieldCheck), { class: "h-3 w-3 mr-1" }),
                                      createTextVNode(" PREMIUM ")
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-40"
                                  }, "Gratuit"))
                                ], 64))
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), { class: "text-right px-4" }, {
                            default: withCtx(() => [
                              checkIsAdmin(user.userId) ? (openBlock(), createBlock(unref(_sfc_main$2), {
                                key: 0,
                                variant: "secondary",
                                size: "sm",
                                class: "h-9 w-full lg:w-32 font-bold flex items-center justify-center gap-2",
                                onClick: withModifiers(($event) => unref(toast).info("Gestion des r\xF4les bient\xF4t disponible"), ["stop"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ShieldCheck), { class: "h-4 w-4" }),
                                  createTextVNode(" Editer R\xF4le ")
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$2), {
                                key: 1,
                                variant: "outline",
                                size: "sm",
                                disabled: isUpdating.value === user.userId,
                                onClick: withModifiers(($event) => toggleCertification(user), ["stop"]),
                                class: `${user.certified ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"} h-9 w-full lg:w-32 transition-all font-bold`
                              }, {
                                default: withCtx(() => [
                                  isUpdating.value === user.userId ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "h-4 w-4 animate-spin mr-2"
                                  })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createTextVNode(toDisplayString(user.certified ? "D\xE9-certifier" : "Certifier"), 1)
                                  ], 64))
                                ]),
                                _: 2
                              }, 1032, ["disabled", "onClick", "class"]))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128)),
                    filteredUsers.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2$1), { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), {
                          colspan: "7",
                          class: "h-64 text-center"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-col items-center justify-center gap-3" }, [
                              createVNode("div", { class: "h-20 w-20 rounded-full bg-muted flex items-center justify-center" }, [
                                createVNode(unref(Search), { class: "h-10 w-10 text-muted-foreground/30" })
                              ]),
                              createVNode("div", { class: "space-y-1" }, [
                                createVNode("p", { class: "text-foreground font-black text-xl" }, "Aucun utilisateur trouv\xE9"),
                                createVNode("p", { class: "text-muted-foreground text-sm" }, "Ajustez vos filtres ou effectuez une nouvelle recherche.")
                              ]),
                              createVNode(unref(_sfc_main$2), {
                                variant: "secondary",
                                onClick: resetFilters,
                                class: "mt-4"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" R\xE9initialiser tout ")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ], 64))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (totalPages.value > 1 && !isLoading.value) {
        _push(`<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4"><div class="text-sm font-medium text-muted-foreground order-2 sm:order-1 flex items-center gap-2"><span class="bg-muted px-2 py-0.5 rounded text-foreground">${ssrInterpolate(paginatedUsers.value.length)}</span> sur <span class="font-bold text-foreground">${ssrInterpolate(filteredUsers.value.length)}</span> membres affich\xE9s </div><div class="flex items-center space-x-2 order-1 sm:order-2 bg-card border p-1 rounded-xl shadow-sm">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "ghost",
          size: "sm",
          disabled: currentPage.value === 1,
          onClick: ($event) => currentPage.value--,
          class: "h-10 px-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4 mr-1" }, null, _parent2, _scopeId));
              _push2(` Pr\xE9c\xE9dent `);
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4 mr-1" }),
                createTextVNode(" Pr\xE9c\xE9dent ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-1 px-4 text-sm font-black"><span class="text-primary">${ssrInterpolate(currentPage.value)}</span><span class="text-muted-foreground">/</span><span>${ssrInterpolate(totalPages.value)}</span></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "ghost",
          size: "sm",
          disabled: currentPage.value === totalPages.value,
          onClick: ($event) => currentPage.value++,
          class: "h-10 px-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 ml-1" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Suivant "),
                createVNode(unref(ChevronRight), { class: "h-4 w-4 ml-1" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ba3n49sy.mjs.map
