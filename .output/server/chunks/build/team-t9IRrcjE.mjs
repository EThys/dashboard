import { defineComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { Users, Target, Award, TrendingUp } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "team",
  __ssrInlineRender: true,
  setup(__props) {
    const teamMembers = [
      {
        name: "Jean-Pierre Mukendi",
        role: "CEO & Fondateur",
        image: "https://i.pravatar.cc/400?img=12",
        bio: "Visionnaire avec 15 ans d'exp\xE9rience dans l'immobilier"
      },
      {
        name: "Marie Kalala",
        role: "Directrice Commerciale",
        image: "https://i.pravatar.cc/400?img=45",
        bio: "Experte en d\xE9veloppement commercial et relations clients"
      },
      {
        name: "David Tshimanga",
        role: "Directeur Technique",
        image: "https://i.pravatar.cc/400?img=33",
        bio: "Architecte logiciel passionn\xE9 par l'innovation"
      },
      {
        name: "Sarah Mbuyi",
        role: "Responsable Marketing",
        image: "https://i.pravatar.cc/400?img=47",
        bio: "Cr\xE9ative et strat\xE8ge en marketing digital"
      },
      {
        name: "Patrick Kabongo",
        role: "Chef de Projet",
        image: "https://i.pravatar.cc/400?img=68",
        bio: "Expert en gestion de projets immobiliers"
      },
      {
        name: "Grace Nzuzi",
        role: "Responsable Services",
        image: "https://i.pravatar.cc/400?img=44",
        bio: "Coordinatrice des services \xE0 domicile"
      }
    ];
    const values = [
      {
        icon: Target,
        title: "Notre Mission",
        description: "Simplifier l'acc\xE8s au logement et aux services \xE0 domicile pour tous les Congolais"
      },
      {
        icon: Award,
        title: "Excellence",
        description: "Fournir des services de qualit\xE9 sup\xE9rieure avec des professionnels certifi\xE9s"
      },
      {
        icon: TrendingUp,
        title: "Innovation",
        description: "Utiliser la technologie pour r\xE9volutionner le secteur immobilier en RDC"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" }, _attrs))} data-v-d1202a6b><section class="relative py-24 overflow-hidden" data-v-d1202a6b><div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-50/50" data-v-d1202a6b></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10" data-v-d1202a6b><div class="max-w-4xl mx-auto text-center space-y-8" data-v-d1202a6b><div class="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm" data-v-d1202a6b>`);
      _push(ssrRenderComponent(unref(Users), { class: "inline h-4 w-4 mr-2" }, null, _parent));
      _push(` Notre \xC9quipe </div><h1 class="text-5xl lg:text-6xl font-black text-foreground leading-tight" data-v-d1202a6b> Rencontrez l&#39;\xC9quipe, <span class="block mt-2 text-primary" data-v-d1202a6b>Qui Change le Jeu</span></h1><p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto" data-v-d1202a6b> Une plateforme tout-en-un pour planifier, collaborer et r\xE9ussir \u2014 plus rapidement et plus intelligemment. </p>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        size: "lg",
        class: "h-14 px-8 font-bold text-base"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Rejoindre l&#39;\xE9quipe `);
          } else {
            return [
              createTextVNode(" Rejoindre l'\xE9quipe ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-20 relative h-80" data-v-d1202a6b><div class="absolute inset-0 flex items-center justify-center" data-v-d1202a6b><div class="flex gap-4 perspective-1000" data-v-d1202a6b><!--[-->`);
      ssrRenderList(teamMembers, (member, index) => {
        _push(`<div class="relative group" style="${ssrRenderStyle({
          transform: `rotateY(${(index - 2.5) * 15}deg) translateZ(${Math.abs(index - 2.5) * -20}px)`,
          zIndex: 6 - Math.abs(index - 2.5)
        })}" data-v-d1202a6b><div class="w-40 h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-500" data-v-d1202a6b><img${ssrRenderAttr("src", member.image)}${ssrRenderAttr("alt", member.name)} class="w-full h-full object-cover" data-v-d1202a6b><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4" data-v-d1202a6b><div class="text-white text-sm font-bold" data-v-d1202a6b>${ssrInterpolate(member.name)}</div></div></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section><section class="py-20" data-v-d1202a6b><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-d1202a6b><div class="text-center mb-16" data-v-d1202a6b><h2 class="text-4xl lg:text-5xl font-black text-foreground mb-4" data-v-d1202a6b> Tout ce Dont Votre \xC9quipe a Besoin <span class="block mt-2" data-v-d1202a6b>Pour Travailler Plus Intelligemment</span></h2><p class="text-lg text-muted-foreground max-w-2xl mx-auto" data-v-d1202a6b> Des outils de suivi des t\xE2ches en temps r\xE9el aux fonctionnalit\xE9s que vous devez garder votre \xE9quipe connect\xE9e, organis\xE9e et avancer ensemble. </p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-v-d1202a6b><!--[-->`);
      ssrRenderList(values, (value, index) => {
        _push(`<div class="group p-8 bg-white rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500" data-v-d1202a6b><div class="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all" data-v-d1202a6b>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(value.icon), { class: "h-8 w-8 text-primary group-hover:text-white transition-colors" }, null), _parent);
        _push(`</div><h3 class="text-2xl font-black text-foreground mb-4" data-v-d1202a6b>${ssrInterpolate(value.title)}</h3><p class="text-muted-foreground leading-relaxed" data-v-d1202a6b>${ssrInterpolate(value.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-20 bg-white" data-v-d1202a6b><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-d1202a6b><div class="text-center mb-16" data-v-d1202a6b><h2 class="text-4xl lg:text-5xl font-black text-foreground mb-4" data-v-d1202a6b> Notre \xC9quipe Talentueuse </h2><p class="text-lg text-muted-foreground" data-v-d1202a6b> Des professionnels passionn\xE9s d\xE9di\xE9s \xE0 votre succ\xE8s </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-d1202a6b><!--[-->`);
      ssrRenderList(teamMembers, (member) => {
        _push(`<div class="group bg-gradient-to-br from-slate-50 to-white rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500" data-v-d1202a6b><div class="relative h-80 overflow-hidden" data-v-d1202a6b><img${ssrRenderAttr("src", member.image)}${ssrRenderAttr("alt", member.name)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-v-d1202a6b><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" data-v-d1202a6b></div><div class="absolute bottom-0 left-0 right-0 p-6 text-white" data-v-d1202a6b><h3 class="text-2xl font-black mb-1" data-v-d1202a6b>${ssrInterpolate(member.name)}</h3><p class="text-primary-foreground/90 font-semibold mb-2" data-v-d1202a6b>${ssrInterpolate(member.role)}</p><p class="text-sm text-white/80" data-v-d1202a6b>${ssrInterpolate(member.bio)}</p></div></div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-20" data-v-d1202a6b><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-d1202a6b><div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" data-v-d1202a6b><div class="space-y-6" data-v-d1202a6b><div class="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm" data-v-d1202a6b> Notre Histoire </div><h2 class="text-4xl lg:text-5xl font-black text-foreground" data-v-d1202a6b> L&#39;Histoire de <span class="block mt-2 text-primary" data-v-d1202a6b>CasaNayo</span></h2><div class="space-y-4 text-lg text-muted-foreground leading-relaxed" data-v-d1202a6b><p data-v-d1202a6b> Fond\xE9e en 2023, CasaNayo est n\xE9e d&#39;une vision simple mais puissante : d\xE9mocratiser l&#39;acc\xE8s au logement et aux services \xE0 domicile en R\xE9publique D\xE9mocratique du Congo. </p><p data-v-d1202a6b> Notre plateforme centralise l&#39;ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services \xE0 domicile. Nous connectons propri\xE9taires, locataires et prestataires de services via une plateforme unique, transparente et efficace. </p><p data-v-d1202a6b> Aujourd&#39;hui, avec plus de 15,000 utilisateurs actifs et 500+ propri\xE9t\xE9s list\xE9es, nous sommes fiers d&#39;\xEAtre le partenaire immobilier de confiance \xE0 Kinshasa et au-del\xE0. </p></div><div class="grid grid-cols-3 gap-6 pt-6" data-v-d1202a6b><div class="text-center" data-v-d1202a6b><div class="text-4xl font-black text-primary mb-2" data-v-d1202a6b>15k+</div><div class="text-sm text-muted-foreground font-medium" data-v-d1202a6b>Utilisateurs</div></div><div class="text-center" data-v-d1202a6b><div class="text-4xl font-black text-primary mb-2" data-v-d1202a6b>500+</div><div class="text-sm text-muted-foreground font-medium" data-v-d1202a6b>Propri\xE9t\xE9s</div></div><div class="text-center" data-v-d1202a6b><div class="text-4xl font-black text-primary mb-2" data-v-d1202a6b>98%</div><div class="text-sm text-muted-foreground font-medium" data-v-d1202a6b>Satisfaction</div></div></div></div><div class="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl" data-v-d1202a6b><img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&amp;w=2670&amp;auto=format&amp;fit=crop" alt="Team collaboration" class="w-full h-full object-cover" data-v-d1202a6b><div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" data-v-d1202a6b></div></div></div></div></section><section class="py-20 bg-gradient-to-br from-primary to-blue-600" data-v-d1202a6b><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-d1202a6b><div class="max-w-3xl mx-auto text-center space-y-8 text-white" data-v-d1202a6b><h2 class="text-4xl lg:text-5xl font-black" data-v-d1202a6b> Pr\xEAt \xE0 Rejoindre Notre Aventure ? </h2><p class="text-xl text-white/90" data-v-d1202a6b> Nous recherchons toujours des talents passionn\xE9s pour rejoindre notre \xE9quipe en pleine croissance. </p><div class="flex flex-col sm:flex-row gap-4 justify-center" data-v-d1202a6b>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        size: "lg",
        class: "h-14 px-8 bg-white text-primary hover:bg-gray-100 font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir les postes ouverts `);
          } else {
            return [
              createTextVNode(" Voir les postes ouverts ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        size: "lg",
        variant: "outline",
        class: "h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-primary font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Nous contacter `);
          } else {
            return [
              createTextVNode(" Nous contacter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/team.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const team = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d1202a6b"]]);

export { team as default };
//# sourceMappingURL=team-t9IRrcjE.mjs.map
