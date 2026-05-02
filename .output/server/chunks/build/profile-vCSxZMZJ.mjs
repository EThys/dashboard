import { l as useAuthStore, n as navigateTo } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _imports_0 } from './congo-DR1txCxA.mjs';
import { Camera, LogOut, User, Mail, Phone, MapPin } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
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
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const user = computed(() => auth.user);
    const profile = computed(() => auth.profile);
    const handleLogout = () => {
      auth.logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50/50 pb-20" }, _attrs))}><div class="h-48 md:h-64 bg-slate-900 relative overflow-hidden"><div class="absolute inset-0 opacity-20"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover"></div><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div></div><div class="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-1 space-y-6"><div class="bg-card rounded-3xl border border-border/40 shadow-xl p-8 text-center relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div><div class="relative inline-block mb-6 group"><div class="size-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-4 ring-primary/5">`);
      if ((_a = unref(profile)) == null ? void 0 : _a.images) {
        _push(`<img${ssrRenderAttr("src", unref(profile).images)} class="size-full object-cover">`);
      } else {
        _push(`<div class="size-full flex items-center justify-center text-4xl font-black text-primary">${ssrInterpolate(((_c = (_b = unref(user)) == null ? void 0 : _b.username) == null ? void 0 : _c.charAt(0).toUpperCase()) || "U")}</div>`);
      }
      _push(`</div><button class="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">`);
      _push(ssrRenderComponent(unref(Camera), { class: "size-5" }, null, _parent));
      _push(`</button></div><h1 class="text-2xl font-black text-slate-800">${ssrInterpolate(((_d = unref(profile)) == null ? void 0 : _d.fullName) || ((_e = unref(user)) == null ? void 0 : _e.username))}</h1><p class="text-slate-500 font-medium mb-6">@${ssrInterpolate((_f = unref(user)) == null ? void 0 : _f.username)}</p><div class="flex flex-wrap justify-center gap-2 mb-8">`);
      if ((_g = unref(user)) == null ? void 0 : _g.premium) {
        _push(`<span class="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-primary/20"> PREMIUM </span>`);
      } else {
        _push(`<!---->`);
      }
      if ((_h = unref(user)) == null ? void 0 : _h.certified) {
        _push(`<span class="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-emerald-500/20"> CERTIFI\xC9 </span>`);
      } else {
        _push(`<span class="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black tracking-widest leading-none"> MEMBRE </span>`);
      }
      _push(`</div><div class="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8"><div class="text-center"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ville</p><p class="font-bold text-slate-800">${ssrInterpolate(((_i = unref(user)) == null ? void 0 : _i.city) || "\u2014")}</p></div><div class="text-center"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pays</p><p class="font-bold text-slate-800">${ssrInterpolate(((_j = unref(user)) == null ? void 0 : _j.country) || "\u2014")}</p></div></div></div>`);
      if (!((_k = unref(user)) == null ? void 0 : _k.certified)) {
        _push(`<div class="bg-[#FFF9F5] rounded-3xl p-6 border border-[#FFEDD5]"><h3 class="font-black text-slate-800 mb-2">Passez \xE0 la certification</h3><p class="text-sm text-slate-600 mb-4 leading-relaxed">V\xE9rifiez votre identit\xE9 pour d\xE9bloquer toutes les fonctionnalit\xE9s et rassurer vos partenaires.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/dashboard/certification"),
          variant: "outline",
          class: "w-full border-primary/20 text-primary font-black hover:bg-primary/5 h-12 rounded-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` D\xE9marrer la v\xE9rification `);
            } else {
              return [
                createTextVNode(" D\xE9marrer la v\xE9rification ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: handleLogout,
        variant: "ghost",
        class: "w-full text-red-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-2xl h-12 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LogOut), { class: "mr-2 size-5" }, null, _parent2, _scopeId));
            _push2(` Se d\xE9connecter `);
          } else {
            return [
              createVNode(unref(LogOut), { class: "mr-2 size-5" }),
              createTextVNode(" Se d\xE9connecter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden"><div class="border-b border-slate-100 px-8 py-6 bg-slate-50/50 flex justify-between items-center"><h2 class="text-xl font-black text-slate-800 flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(User), { class: "size-6 text-primary" }, null, _parent));
      _push(` Informations Personnelles </h2>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "link",
        class: "font-black text-primary text-sm p-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Modifier`);
          } else {
            return [
              createTextVNode("Modifier")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pr\xE9nom Nom</label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_l = unref(profile)) == null ? void 0 : _l.fullName) || "\u2014")}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-3" }, null, _parent));
      _push(` Adresse Email </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate((_m = unref(user)) == null ? void 0 : _m.email)}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-3" }, null, _parent));
      _push(` Num\xE9ro de t\xE9l\xE9phone </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_n = unref(user)) == null ? void 0 : _n.phone) || "Non renseign\xE9")}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-3" }, null, _parent));
      _push(` Localisation </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate((_o = unref(user)) == null ? void 0 : _o.city)}, ${ssrInterpolate((_p = unref(user)) == null ? void 0 : _p.country)}</p></div><div class="space-y-1 col-span-full"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-3" }, null, _parent));
      _push(` Adresse physique </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_q = unref(profile)) == null ? void 0 : _q.address) || "Adresse non renseign\xE9e")}</p></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-vCSxZMZJ.mjs.map
