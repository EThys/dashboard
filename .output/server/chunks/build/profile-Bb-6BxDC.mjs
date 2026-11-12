import { m as useAuthStore, n as navigateTo } from './server.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './congo-DR1txCxA.mjs';
import { Loader2, Camera, LogOut, User, Mail, Phone, MapPin } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
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
    const editing = ref(false);
    const saving = ref(false);
    const uploadingPhoto = ref(false);
    const photoPreview = ref(null);
    ref(null);
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      address: ""
    });
    const avatarSrc = computed(() => {
      var _a;
      return photoPreview.value || ((_a = profile.value) == null ? void 0 : _a.images) || "";
    });
    const displayName = computed(() => {
      var _a, _b;
      return ((_a = profile.value) == null ? void 0 : _a.fullName) || ((_b = user.value) == null ? void 0 : _b.username) || "Membre";
    });
    function splitName(fullName) {
      var _a, _b;
      const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
      return {
        firstName: ((_a = profile.value) == null ? void 0 : _a.firstName) || parts[0] || "",
        lastName: ((_b = profile.value) == null ? void 0 : _b.lastName) || parts.slice(1).join(" ") || ""
      };
    }
    function startEdit() {
      var _a, _b, _c, _d, _e, _f;
      const names = splitName((_a = profile.value) == null ? void 0 : _a.fullName);
      form.firstName = names.firstName;
      form.lastName = names.lastName;
      form.email = ((_b = user.value) == null ? void 0 : _b.email) || "";
      form.phone = ((_c = user.value) == null ? void 0 : _c.phone) && user.value.phone !== "null" ? user.value.phone : "";
      form.city = ((_d = user.value) == null ? void 0 : _d.city) || "";
      form.country = ((_e = user.value) == null ? void 0 : _e.country) || "";
      form.address = ((_f = profile.value) == null ? void 0 : _f.address) || "";
      editing.value = true;
    }
    function cancelEdit() {
      editing.value = false;
    }
    const handleLogout = () => {
      auth.logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50/50 pb-20" }, _attrs))}><div class="h-48 md:h-64 bg-slate-900 relative overflow-hidden"><div class="absolute inset-0 opacity-20"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover"></div><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div></div><div class="container mx-auto px-4 -mt-20 relative z-10 max-w-6xl"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-1 space-y-6"><div class="bg-card rounded-3xl border border-border/40 shadow-xl p-8 text-center relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div><div class="relative inline-block mb-6"><div class="relative size-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-4 ring-primary/5">`);
      if (unref(avatarSrc)) {
        _push(`<img${ssrRenderAttr("src", unref(avatarSrc))} alt="" class="size-full object-cover">`);
      } else {
        _push(`<div class="size-full flex items-center justify-center text-4xl font-black text-primary">${ssrInterpolate(unref(displayName).charAt(0).toUpperCase())}</div>`);
      }
      if (unref(uploadingPhoto)) {
        _push(`<div class="absolute inset-0 bg-slate-900/45 flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "size-7 animate-spin text-white" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="button" class="absolute bottom-1 right-1 size-10 rounded-full bg-primary text-white border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"${ssrIncludeBooleanAttr(unref(uploadingPhoto)) ? " disabled" : ""} aria-label="Changer la photo">`);
      _push(ssrRenderComponent(unref(Camera), { class: "size-5" }, null, _parent));
      _push(`</button><input type="file" accept="image/*" class="hidden"></div><h1 class="text-2xl font-black text-slate-800">${ssrInterpolate(unref(displayName))}</h1><p class="text-slate-500 font-medium mb-2">@${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.username)}</p><button type="button" class="text-sm font-bold text-primary hover:underline mb-6"> Changer la photo </button><div class="flex flex-wrap justify-center gap-2 mb-8">`);
      if ((_b = unref(user)) == null ? void 0 : _b.premium) {
        _push(`<span class="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-primary/20"> PREMIUM </span>`);
      } else {
        _push(`<!---->`);
      }
      if ((_c = unref(user)) == null ? void 0 : _c.certified) {
        _push(`<span class="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-widest leading-none shadow-lg shadow-emerald-500/20"> CERTIFI\xC9 </span>`);
      } else {
        _push(`<span class="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black tracking-widest leading-none"> MEMBRE </span>`);
      }
      _push(`</div><div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6"><div class="text-center"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ville</p><p class="font-bold text-slate-800">${ssrInterpolate(((_d = unref(user)) == null ? void 0 : _d.city) || "\u2014")}</p></div><div class="text-center"><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pays</p><p class="font-bold text-slate-800">${ssrInterpolate(((_e = unref(user)) == null ? void 0 : _e.country) || "\u2014")}</p></div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        type: "button",
        variant: "outline",
        class: "mt-6 w-full h-12 rounded-xl border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 hover:text-red-700",
        onClick: handleLogout
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
      _push(`</div>`);
      if (!((_f = unref(user)) == null ? void 0 : _f.certified)) {
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
      _push(`</div><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden"><div class="border-b border-slate-100 px-8 py-6 bg-slate-50/50 flex justify-between items-center gap-4"><h2 class="text-xl font-black text-slate-800 flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(User), { class: "size-6 text-primary" }, null, _parent));
      _push(` Informations personnelles </h2>`);
      if (!unref(editing)) {
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "link",
          class: "font-black text-primary text-sm p-0",
          onClick: startEdit
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Modifier `);
            } else {
              return [
                createTextVNode(" Modifier ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(editing)) {
        _push(`<form class="p-8 grid grid-cols-1 md:grid-cols-2 gap-5"><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pr\xE9nom</span><input${ssrRenderAttr("value", unref(form).firstName)} required class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</span><input${ssrRenderAttr("value", unref(form).lastName)} required class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">T\xE9l\xE9phone</span><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</span><input${ssrRenderAttr("value", unref(form).city)} class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pays</span><input${ssrRenderAttr("value", unref(form).country)} class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><label class="space-y-1.5 md:col-span-2"><span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse</span><input${ssrRenderAttr("value", unref(form).address)} class="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary outline-none"></label><div class="md:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          type: "button",
          variant: "outline",
          class: "h-12 rounded-xl",
          disabled: unref(saving),
          onClick: cancelEdit
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Annuler `);
            } else {
              return [
                createTextVNode(" Annuler ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          type: "submit",
          class: "h-12 rounded-xl bg-primary hover:bg-primary/90",
          disabled: unref(saving)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(saving)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` Enregistrer `);
            } else {
              return [
                unref(saving) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 size-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" Enregistrer ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form>`);
      } else {
        _push(`<div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8"><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pr\xE9nom Nom</label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_g = unref(profile)) == null ? void 0 : _g.fullName) || "\u2014")}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Mail), { class: "size-3" }, null, _parent));
        _push(` Adresse email </label><p class="text-lg font-bold text-slate-800 break-all">${ssrInterpolate(((_h = unref(user)) == null ? void 0 : _h.email) || "\u2014")}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Phone), { class: "size-3" }, null, _parent));
        _push(` Num\xE9ro de t\xE9l\xE9phone </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_i = unref(user)) == null ? void 0 : _i.phone) && unref(user).phone !== "null" ? unref(user).phone : "Non renseign\xE9")}</p></div><div class="space-y-1"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "size-3" }, null, _parent));
        _push(` Localisation </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate([(_j = unref(user)) == null ? void 0 : _j.city, (_k = unref(user)) == null ? void 0 : _k.country].filter(Boolean).join(", ") || "\u2014")}</p></div><div class="space-y-1 md:col-span-2"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "size-3" }, null, _parent));
        _push(` Adresse </label><p class="text-lg font-bold text-slate-800">${ssrInterpolate(((_l = unref(profile)) == null ? void 0 : _l.address) || "Adresse non renseign\xE9e")}</p></div></div>`);
      }
      _push(`</div></div></div></div></div>`);
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
//# sourceMappingURL=profile-Bb-6BxDC.mjs.map
