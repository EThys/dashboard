import { l as useAuthStore, s as useMembersStore, t as __nuxt_component_0$1, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { RotateCcw, Loader2, UserCheck, ShieldCheck, Check, ShieldAlert } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1 } from './Badge-CZaU8sYj.mjs';
import { p as process } from './array.operators-CqYfjdq6.mjs';
import { useRouter } from 'vue-router';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { a as accountTypeLabel } from './userAccount-cLuxjLEr.mjs';
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
import '@tanstack/vue-query';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const auth = useAuthStore();
    const membersStore = useMembersStore();
    const config = useRuntimeConfig();
    const users = computed(() => membersStore.users);
    const isLoading = ref(true);
    const isUpdating = ref(null);
    const showAdmins = ref(false);
    const dataState = ref({
      skip: 0,
      take: 10,
      sort: [{ field: "userId", dir: "desc" }]
    });
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
    const checkIsAdmin = (userId) => {
      const member = membersStore.getMemberByUserId(userId);
      if (!member || !member.accounts) return false;
      return member.accounts.some((acc) => acc.id === 18 || acc.id === 19);
    };
    const gridSource = computed(() => {
      const list = users.value.filter((user) => showAdmins.value ? checkIsAdmin(user.userId) : !checkIsAdmin(user.userId));
      return list.map((user) => ({
        ...user,
        contact: [user.email, user.phone && user.phone !== "null" ? user.phone : ""].filter(Boolean).join(" \xB7 ") || "\u2014",
        location: [user.city, user.country].filter(Boolean).join(", ") || "Inconnue",
        compte: accountTypeLabel(membersStore.getMemberByUserId(user.userId)),
        statut: checkIsAdmin(user.userId) ? "Admin" : user.certified ? "Certifi\xE9" : "Non certifi\xE9",
        abonnement: checkIsAdmin(user.userId) ? "Staff" : user.premium ? "Premium" : "Gratuit",
        busy: isUpdating.value === user.userId
      }));
    });
    computed(() => process(gridSource.value, dataState.value));
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
    watch(showAdmins, () => {
      dataState.value = { ...dataState.value, skip: 0 };
    });
    const resetFilters = () => {
      showAdmins.value = false;
      dataState.value = { skip: 0, take: 10, sort: [{ field: "userId", dir: "desc" }] };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
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
      _push(`</div><div><p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Premium</p><p class="text-2xl font-black">${ssrInterpolate(stats.value.premium)}</p></div></div></div><div class="flex flex-wrap items-center gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        type: "button",
        size: "sm",
        variant: !showAdmins.value ? "default" : "outline",
        onClick: ($event) => showAdmins.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Utilisateurs`);
          } else {
            return [
              createTextVNode("Utilisateurs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        type: "button",
        size: "sm",
        variant: showAdmins.value ? "default" : "outline",
        onClick: ($event) => showAdmins.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Staff / Admins`);
          } else {
            return [
              createTextVNode("Staff / Admins")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        type: "button",
        size: "sm",
        variant: "ghost",
        class: "ml-auto",
        onClick: resetFilters
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`R\xE9initialiser les filtres`);
          } else {
            return [
              createTextVNode("R\xE9initialiser les filtres")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isLoading.value) {
        _push(`<div class="flex items-center gap-2 text-sm text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
        _push(` Synchronisation avec le serveur... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
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
//# sourceMappingURL=index-vBdmdOwJ.mjs.map
