import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import VueEasyLightbox from 'vue-easy-lightbox';
import { Wrench, ArrowLeft, CheckCircle, Maximize, Calendar, MapPin, Star, ShieldCheck, Loader2, EyeOff, Trash2 } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1 } from './Skeleton-BgOY-K4r.mjs';
import { g as useServiceStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const serviceStore = useServiceStore();
    const serviceId = String(route.params.id);
    const { data: servicesData, isLoading, isError } = useQuery({
      queryKey: ["prestations-detail", serviceId],
      queryFn: async () => {
        const res = await fetch(joinApi(config.public.apiBase, ApiEndpoints.publicPrestations));
        return res.json();
      }
    });
    const service = computed(() => {
      var _a, _b, _c;
      let found = serviceStore.services.find((s) => String(s.prestation.id) === serviceId);
      if (!found && ((_a = servicesData.value) == null ? void 0 : _a.prestations)) {
        found = servicesData.value.prestations.find((s) => String(s.prestation.id) === serviceId);
      }
      if (!found) return null;
      const p = found.prestation;
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.minPrice,
        currency: p.deviseId === 1 ? "CDF" : "USD",
        minPriceFormatted: `\xC0 partir de ${p.minPrice.toLocaleString()} ${p.deviseId === 1 ? "CDF" : "$"}`,
        active: p.active,
        status: p.active ? "Active" : "Inactive",
        certified: p.certified,
        experience: p.experience,
        location: {
          city: p.cityValue,
          commune: p.communeValue,
          full: `${p.communeValue}, ${p.cityValue}`
        },
        availabilityDays: p.plageJourPrestation || "",
        // String of days
        availabilityHours: p.plageHeurePrestation || "",
        // String of hours
        images: ((_b = found.image) == null ? void 0 : _b.map((i) => i.path)) || [],
        publisher: {
          username: ((_c = found.postBy) == null ? void 0 : _c.replace("@@", "")) || "Inconnu",
          avatar: p.profile
        },
        createdAt: new Date(p.dateCreated).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
        category: getCategoryName(p.serviceId)
      };
    });
    const isUpdating = ref(false);
    const toggleActivity = async () => {
      if (!service.value) return;
      isUpdating.value = true;
      const newStatus = !service.value.active;
      try {
        await serviceStore.updateService(
          Number(serviceId),
          { active: newStatus },
          config.public.apiBase
        );
        toast.success(newStatus ? "Service activ\xE9" : "Service d\xE9sactiv\xE9");
      } catch (e) {
        toast.error("\xC9chec de la mise \xE0 jour");
      }
      isUpdating.value = false;
    };
    const getCategoryName = (id) => {
      const cat = serviceStore.categories.find((c) => c.id === id);
      return cat ? cat.name : "Service";
    };
    const goBack = () => router.push("/dashboard/publications?tab=services");
    const visibleRef = ref(false);
    const indexRef = ref(0);
    const currentLightboxImages = ref([]);
    const onHide = () => visibleRef.value = false;
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, _attrs))}>`);
      if (unref(isLoading) && !service.value) {
        _push(`<div class="space-y-8 animate-pulse">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-[50vh] w-full rounded-3xl" }, null, _parent));
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-12 w-3/4 rounded-lg" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-32 w-full rounded-2xl" }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-64 w-full rounded-2xl" }, null, _parent));
        _push(`</div></div>`);
      } else if (!service.value) {
        _push(`<div class="flex flex-col items-center justify-center py-32 text-center"><div class="bg-destructive/10 p-8 rounded-full mb-6">`);
        _push(ssrRenderComponent(unref(Wrench), { class: "h-16 w-16 text-destructive" }, null, _parent));
        _push(`</div><h3 class="text-3xl font-bold text-foreground mb-3">Service introuvable</h3><p class="text-muted-foreground mb-8 max-w-md text-lg">Ce service n&#39;existe plus ou a \xE9t\xE9 supprim\xE9.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: goBack,
          size: "lg",
          class: "rounded-full px-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour aux services`);
            } else {
              return [
                createTextVNode("Retour aux services")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"><div class="flex items-center gap-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "ghost",
          onClick: goBack,
          class: "gap-2 hover:bg-transparent hover:text-primary transition-colors pl-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-5 w-5" }, null, _parent2, _scopeId));
              _push2(` Retour aux services `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "h-5 w-5" }),
                createTextVNode(" Retour aux services ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex items-center gap-3">`);
        if (service.value.certified) {
          _push(`<div class="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-semibold border border-blue-500/20">`);
          _push(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent));
          _push(` Certifi\xE9 </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([service.value.status === "Active" ? "text-green-600 bg-green-500/10 border-green-500/20" : "text-orange-600 bg-orange-500/10 border-orange-500/20", "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border"])}"><div class="${ssrRenderClass([service.value.status === "Active" ? "bg-green-600" : "bg-orange-600", "w-2 h-2 rounded-full"])}"></div> ${ssrInterpolate(service.value.status === "Active" ? "En ligne" : "Inactif")}</div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[550px]"><div class="md:col-span-2 md:row-span-2 relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"><img${ssrRenderAttr("src", service.value.images[0] || "/placeholder-service.jpg")} class="${ssrRenderClass([{ "grayscale": service.value.status === "Inactive" }, "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"])}"><div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div><div class="absolute bottom-6 left-6 inline-flex px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/20">`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-4 w-4 mr-2" }, null, _parent));
        _push(` Voir les photos </div></div>`);
        if (service.value.images.length > 1) {
          _push(`<!--[-->`);
          ssrRenderList(service.value.images.slice(1, 5), (img, idx) => {
            _push(`<div class="relative group rounded-2xl overflow-hidden cursor-pointer hidden md:block"><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>`);
            if (idx === 3 && service.value.images.length > 5) {
              _push(`<div class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><span class="text-white font-bold text-2xl">+${ssrInterpolate(service.value.images.length - 5)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-12 gap-12"><div class="lg:col-span-8 space-y-12"><div class="pb-8 border-b border-border/50"><div class="flex items-center gap-2 mb-4"><span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">${ssrInterpolate(service.value.category)}</span><span class="text-sm text-muted-foreground flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-3 w-3" }, null, _parent));
        _push(` ${ssrInterpolate(service.value.createdAt)}</span></div><h1 class="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight mb-4">${ssrInterpolate(service.value.title)}</h1><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div class="flex items-center gap-2 text-lg text-muted-foreground">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate(service.value.location.full)}</div><div class="flex flex-col items-end"><span class="text-xs text-muted-foreground uppercase font-bold tracking-wider">\xC0 partir de</span><div class="text-3xl font-black text-primary whitespace-nowrap bg-primary/5 px-4 py-2 rounded-xl">${ssrInterpolate(service.value.minPriceFormatted.split(" ").slice(3).join(" "))}</div></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="bg-card border p-5 rounded-2xl flex items-center gap-4 shadow-sm"><div class="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">`);
        _push(ssrRenderComponent(unref(Wrench), { class: "h-6 w-6" }, null, _parent));
        _push(`</div><div><span class="block font-bold text-lg">Service Pro</span><span class="text-sm text-muted-foreground">${ssrInterpolate(service.value.category)}</span></div></div><div class="bg-card border p-5 rounded-2xl flex items-center gap-4 shadow-sm"><div class="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">`);
        _push(ssrRenderComponent(unref(Star), { class: "h-6 w-6" }, null, _parent));
        _push(`</div><div><span class="block font-bold text-lg">${ssrInterpolate(service.value.experience || "N/A")} ans</span><span class="text-sm text-muted-foreground">Exp\xE9rience</span></div></div></div><div><h2 class="text-2xl font-bold mb-6">\xC0 propos du service</h2><div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed"><p class="whitespace-pre-line">${ssrInterpolate(service.value.description)}</p></div></div>`);
        if (service.value.availabilityDays || service.value.availabilityHours) {
          _push(`<div class="space-y-6"><h2 class="text-2xl font-bold mb-6">Disponibilit\xE9s</h2>`);
          if (service.value.availabilityDays) {
            _push(`<div class="space-y-3"><h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">`);
            _push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
            _push(` Jours disponibles </h3><div class="flex flex-wrap gap-3"><!--[-->`);
            ssrRenderList(service.value.availabilityDays.split(", "), (day, idx) => {
              _push(`<div class="px-5 py-2.5 rounded-xl bg-background border border-border font-medium text-foreground hover:border-primary/50 transition-colors shadow-sm">${ssrInterpolate(day)}</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (service.value.availabilityHours) {
            _push(`<div class="space-y-3"><h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">`);
            _push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
            _push(` Horaires </h3><div class="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/5 border border-primary/20"><div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">`);
            _push(ssrRenderComponent(unref(Calendar), { class: "h-6 w-6 text-primary" }, null, _parent));
            _push(`</div><div><span class="block font-bold text-xl text-primary">${ssrInterpolate(service.value.availabilityHours)}</span><span class="text-sm text-muted-foreground">Plage horaire</span></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-6"><h2 class="text-2xl font-bold">Informations techniques</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border/50"><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">ID du service</p><p class="font-mono text-sm bg-white px-3 py-1.5 rounded border inline-block">${ssrInterpolate(service.value.id)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Ville</p><p class="font-medium">${ssrInterpolate(service.value.location.city)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Commune</p><p class="font-medium">${ssrInterpolate(service.value.location.commune)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Date de cr\xE9ation</p><p class="font-medium">${ssrInterpolate(service.value.createdAt)}</p></div></div></div></div><div class="lg:col-span-4 space-y-8"><div class="rounded-[2rem] border bg-slate-900 text-white p-8 space-y-6 shadow-xl shadow-slate-200"><div class="flex items-center gap-3 pb-4 border-b border-white/10"><div class="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(`</div><div><h3 class="font-bold text-lg">Actions Admin</h3><p class="text-xs text-white/50">Gestion du service</p></div></div><div class="space-y-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: toggleActivity,
          variant: "secondary",
          disabled: isUpdating.value,
          class: "w-full h-12 rounded-xl font-bold justify-start gap-3 bg-white/10 hover:bg-white/20 border-none text-white transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b, _c, _d;
            if (_push2) {
              if (isUpdating.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!--[-->`);
                if ((_a2 = service.value) == null ? void 0 : _a2.active) {
                  _push2(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                }
                _push2(`<!--]-->`);
              }
              _push2(` ${ssrInterpolate(((_b = service.value) == null ? void 0 : _b.active) ? "D\xE9sactiver le service" : "Activer le service")}`);
            } else {
              return [
                isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "h-4 w-4 animate-spin"
                })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  ((_c = service.value) == null ? void 0 : _c.active) ? (openBlock(), createBlock(unref(EyeOff), {
                    key: 0,
                    class: "h-4 w-4"
                  })) : (openBlock(), createBlock(unref(CheckCircle), {
                    key: 1,
                    class: "h-4 w-4"
                  }))
                ], 64)),
                createTextVNode(" " + toDisplayString(((_d = service.value) == null ? void 0 : _d.active) ? "D\xE9sactiver le service" : "Activer le service"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "destructive",
          class: "w-full h-12 rounded-xl font-bold justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Supprimer le service `);
            } else {
              return [
                createVNode(unref(Trash2), { class: "h-4 w-4" }),
                createTextVNode(" Supprimer le service ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="rounded-[2rem] border bg-card shadow-lg shadow-primary/5 p-8 sticky top-24"><div class="flex items-center justify-between mb-6"><h3 class="font-bold text-lg">Prestataire</h3><div class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">En ligne</div></div><div class="flex items-center gap-4 mb-8"><div class="relative group cursor-pointer">`);
        if (service.value.publisher.avatar) {
          _push(`<img${ssrRenderAttr("src", service.value.publisher.avatar)} class="h-20 w-20 rounded-full object-cover border-4 border-background shadow-md transition-transform group-hover:scale-105">`);
        } else {
          _push(`<div class="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl border-4 border-background shadow-md">${ssrInterpolate((_a = service.value.publisher.username) == null ? void 0 : _a.substring(0, 2).toUpperCase())}</div>`);
        }
        if (service.value.publisher.avatar) {
          _push(`<div class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-white" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><p class="font-bold text-xl leading-tight">${ssrInterpolate(service.value.publisher.username)}</p><p class="text-sm text-muted-foreground">Expert Certifi\xE9</p></div></div><div class="space-y-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          class: "w-full rounded-xl h-12 text-base"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Voir le profil`);
            } else {
              return [
                createTextVNode("Voir le profil")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), { class: "w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Contacter`);
            } else {
              return [
                createTextVNode("Contacter")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      }
      _push(ssrRenderComponent(unref(VueEasyLightbox), {
        visible: visibleRef.value,
        imgs: currentLightboxImages.value,
        index: indexRef.value,
        onHide
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/publications/services/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-B91uf5L5.mjs.map
