import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, watch, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _export_sfc, q as _imports_0, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { Mail, Lock, Eye, EyeOff, MapPin, User, CheckCircle2, Briefcase, Building2, Truck, Zap, Paintbrush, Grid, Hammer, Ruler, PenTool, Car, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { useRouter } from 'vue-router';
import { t as toast } from './index-DJGQOf1Z.mjs';
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
    const currentStep = ref(1);
    const isLoading = ref(false);
    const showPassword = ref(false);
    const form = ref({
      username: "",
      email: "",
      password: "",
      phone: "",
      phoneNumber: "",
      city: "",
      country: "RDC",
      firstName: "",
      lastName: "",
      address: ""
    });
    const selectedCallingCode = ref("+243");
    const countryCodes = [
      // Africa (30+)
      { code: "+243", flag: "\u{1F1E8}\u{1F1E9}", name: "RDC" },
      { code: "+242", flag: "\u{1F1E8}\u{1F1EC}", name: "Congo-Brazzaville" },
      { code: "+27", flag: "\u{1F1FF}\u{1F1E6}", name: "Afrique du Sud" },
      { code: "+234", flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria" },
      { code: "+254", flag: "\u{1F1F0}\u{1F1EA}", name: "Kenya" },
      { code: "+212", flag: "\u{1F1F2}\u{1F1E6}", name: "Maroc" },
      { code: "+20", flag: "\u{1F1EA}\u{1F1EC}", name: "\xC9gypte" },
      { code: "+221", flag: "\u{1F1F8}\u{1F1F3}", name: "S\xE9n\xE9gal" },
      { code: "+225", flag: "\u{1F1E8}\u{1F1EE}", name: "C\xF4te d'Ivoire" },
      { code: "+237", flag: "\u{1F1E8}\u{1F1F2}", name: "Cameroun" },
      { code: "+216", flag: "\u{1F1F9}\u{1F1F3}", name: "Tunisie" },
      { code: "+213", flag: "\u{1F1E9}\u{1F1FF}", name: "Alg\xE9rie" },
      { code: "+251", flag: "\u{1F1EA}\u{1F1F9}", name: "\xC9thiopie" },
      { code: "+255", flag: "\u{1F1F9}\u{1F1FF}", name: "Tanzanie" },
      { code: "+256", flag: "\u{1F1FA}\u{1F1EC}", name: "Ouganda" },
      { code: "+260", flag: "\u{1F1FF}\u{1F1F2}", name: "Zambie" },
      { code: "+263", flag: "\u{1F1FF}\u{1F1FC}", name: "Zimbabwe" },
      { code: "+244", flag: "\u{1F1E6}\u{1F1F4}", name: "Angola" },
      { code: "+250", flag: "\u{1F1F7}\u{1F1FC}", name: "Rwanda" },
      { code: "+257", flag: "\u{1F1E7}\u{1F1EE}", name: "Burundi" },
      { code: "+241", flag: "\u{1F1EC}\u{1F1E6}", name: "Gabon" },
      { code: "+228", flag: "\u{1F1F9}\u{1F1EC}", name: "Togo" },
      { code: "+229", flag: "\u{1F1E7}\u{1F1EF}", name: "B\xE9nin" },
      { code: "+223", flag: "\u{1F1F2}\u{1F1F1}", name: "Mali" },
      { code: "+226", flag: "\u{1F1E7}\u{1F1EB}", name: "Burkina Faso" },
      { code: "+227", flag: "\u{1F1F3}\u{1F1EA}", name: "Niger" },
      { code: "+235", flag: "\u{1F1F9}\u{1F1E9}", name: "Tchad" },
      { code: "+236", flag: "\u{1F1E8}\u{1F1EB}", name: "RCA" },
      { code: "+261", flag: "\u{1F1F2}\u{1F1EC}", name: "Madagascar" },
      { code: "+230", flag: "\u{1F1F2}\u{1F1FA}", name: "Maurice" },
      { code: "+248", flag: "\u{1F1F8}\u{1F1E8}", name: "Seychelles" },
      // Europe & Others
      { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", name: "France" },
      { code: "+32", flag: "\u{1F1E7}\u{1F1EA}", name: "Belgique" },
      { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "\xC9tats-Unis/Canada" },
      { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "Royaume-Uni" },
      { code: "+41", flag: "\u{1F1E8}\u{1F1ED}", name: "Suisse" },
      { code: "+49", flag: "\u{1F1E9}\u{1F1EA}", name: "Allemagne" },
      { code: "+34", flag: "\u{1F1EA}\u{1F1F8}", name: "Espagne" },
      { code: "+39", flag: "\u{1F1EE}\u{1F1F9}", name: "Italie" },
      { code: "+86", flag: "\u{1F1E8}\u{1F1F3}", name: "Chine" },
      { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", name: "Inde" },
      { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", name: "\xC9mirats Arabes Unis" }
    ];
    const showCitySuggestions = ref(false);
    const allCities = [
      // RDC (50 approx examples)
      "Kinshasa",
      "Lubumbashi",
      "Kisangani",
      "Goma",
      "Bukavu",
      "Likasi",
      "Kolwezi",
      "Kananga",
      "Mbuji-Mayi",
      "Matadi",
      "Kikwit",
      "Mbandaka",
      "Uvira",
      "Butembo",
      "Beni",
      "Bunia",
      "Gemena",
      "Kindu",
      "Bandundu",
      "Isiro",
      "Kalemie",
      "Kamina",
      "Lisala",
      "Lodja",
      "Kabinda",
      "Mwene-Ditu",
      "Tshikapa",
      "Boma",
      "Gandajika",
      "Ilebo",
      "Kongolo",
      "Sakania",
      "Kasumbalesa",
      "Vivi",
      "Muanda",
      "Inga",
      "Kipushi",
      "Dilolo",
      "Manono",
      "Pweto",
      // Europe (10)
      "Paris",
      "Bruxelles",
      "Londres",
      "Berlin",
      "Madrid",
      "Rome",
      "Amsterdam",
      "Lisbonne",
      "Gen\xE8ve",
      "Vienne",
      // Africa (10)
      "Johannesburg",
      "Lagos",
      "Cairo",
      "Nairobi",
      "Casablanca",
      "Abidjan",
      "Dakar",
      "Accra",
      "Luanda",
      "Kigali",
      // America (10)
      "New York",
      "Los Angeles",
      "Chicago",
      "Toronto",
      "Montr\xE9al",
      "Miami",
      "S\xE3o Paulo",
      "Mexico City",
      "Buenos Aires",
      "Bogota"
    ];
    const filteredCities = ref([]);
    const filterCities = () => {
      if (!form.value.city) {
        filteredCities.value = allCities.slice(0, 10).sort();
        return;
      }
      const query = form.value.city.toLowerCase();
      filteredCities.value = allCities.filter((c) => c.toLowerCase().includes(query)).slice(0, 50);
    };
    const hideSuggestions = () => {
      setTimeout(() => {
        showCitySuggestions.value = false;
      }, 200);
    };
    filteredCities.value = allCities.slice(0, 20);
    watch(() => form.value.phoneNumber, (newVal) => {
      if (newVal && newVal.startsWith("0")) {
        form.value.phoneNumber = newVal.substring(1);
      }
    });
    const isLocataire = ref(false);
    const selectedProprietaire = ref(null);
    const selectedPrestataire = ref(null);
    const proprietaires = [
      { id: 1, name: "Commissionnaire", desc: "Interm\xE9diaire", icon: Briefcase },
      { id: 2, name: "Bailleur", desc: "Propri\xE9taire", icon: Building2 },
      { id: 3, name: "G\xE9rant", desc: "Gestionnaire", icon: User }
    ];
    const prestataires = [
      { id: 5, name: "Majordome", icon: User },
      { id: 6, name: "D\xE9m\xE9nagement", icon: Truck },
      { id: 7, name: "\xC9lectricien", icon: Zap },
      { id: 8, name: "Salubrit\xE9", icon: Paintbrush },
      { id: 9, name: "Peintre", icon: Paintbrush },
      { id: 10, name: "Carreleur", icon: Grid },
      { id: 11, name: "Menuisier", icon: Hammer },
      { id: 12, name: "Frigoriste", icon: Grid },
      { id: 13, name: "Ajusteur", icon: Ruler },
      { id: 14, name: "Architecte", icon: PenTool },
      { id: 15, name: "Chauffeur", icon: Car },
      { id: 16, name: "Plombier", icon: Ruler },
      { id: 17, name: "Ma\xE7on", icon: Hammer }
    ];
    const nextStep = () => {
      if (!form.value.firstName || !form.value.lastName) {
        toast.error("Champs manquants", { description: "Veuillez entrer votre nom et pr\xE9nom." });
        return;
      }
      if (!form.value.city) {
        toast.error("Ville manquante", { description: "Veuillez s\xE9lectionner votre ville." });
        return;
      }
      if (!form.value.email && !form.value.phoneNumber) {
        toast.error("Moyen de contact requis", {
          description: "Veuillez renseigner au moins une adresse email ou un num\xE9ro de t\xE9l\xE9phone."
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.value.email && !emailRegex.test(form.value.email)) {
        toast.error("Email invalide", { description: "Veuillez entrer une adresse email valide." });
        return;
      }
      if (selectedCallingCode.value === "+243" && form.value.phoneNumber) {
        const phone = form.value.phoneNumber.replace(/\D/g, "");
        const validPrefixes = ["85", "84", "80", "83", "86", "81", "82", "89", "99", "98", "97"];
        const prefix = phone.substring(0, 2);
        if (phone.length !== 9) {
          toast.error("Num\xE9ro invalide", { description: "Le num\xE9ro doit contenir exactement 9 chiffres (ex: 81...) " });
          return;
        }
        if (!validPrefixes.includes(prefix)) {
          toast.error("Op\xE9rateur inconnu", { description: "Ce num\xE9ro existe-t-il vraiment en RDC ? V\xE9rifiez le pr\xE9fixe." });
          return;
        }
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(form.value.password)) {
        toast.error("Mot de passe trop faible", {
          description: "Il doit contenir au moins 6 caract\xE8res, une majuscule, une minuscule et un chiffre."
        });
        return;
      }
      if (currentStep.value === 1) {
        currentStep.value = 2;
      }
    };
    const prevStep = () => {
      if (currentStep.value === 2) {
        currentStep.value = 1;
      }
    };
    const isInfoValid = computed(() => {
      const hasBasicInfo = form.value.firstName && form.value.lastName && form.value.city;
      const hasContact = form.value.email || form.value.phoneNumber;
      const hasPassword = form.value.password && form.value.password.length >= 6;
      return !!(hasBasicInfo && hasContact && hasPassword);
    });
    const isRoleValid = computed(() => {
      return isLocataire.value || selectedProprietaire.value !== null || selectedPrestataire.value !== null;
    });
    const config = useRuntimeConfig();
    const router = useRouter();
    const handleRegister = async () => {
      var _a, _b, _c, _d;
      if (!isRoleValid.value) return;
      isLoading.value = true;
      const fullPhone = form.value.phoneNumber ? `${selectedCallingCode.value}${form.value.phoneNumber}` : "";
      const accountPayload = [];
      if (isLocataire.value) accountPayload.push({ typeAccount: 4 });
      if (selectedProprietaire.value) accountPayload.push({ typeAccount: selectedProprietaire.value });
      if (selectedPrestataire.value) accountPayload.push({ typeAccount: selectedPrestataire.value });
      const payload = {
        user: {
          username: "",
          password: form.value.password,
          email: form.value.email,
          phone: fullPhone,
          city: form.value.city,
          country: form.value.country
        },
        actor: {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          address: form.value.city,
          images: "",
          typeCardId: 0,
          numberCard: "",
          cardFront: "",
          cardBack: "",
          parrainId: 0
        },
        account: accountPayload
      };
      try {
        const res = await $fetch(joinApi(config.public.apiBase, ApiEndpoints.register), {
          method: "POST",
          body: payload
        });
        console.log("Inscription response:", res);
        const fullName = ((_b = (_a = res.member) == null ? void 0 : _a.profile) == null ? void 0 : _b.fullName) || ((_c = res.actor) == null ? void 0 : _c.fullName) || form.value.firstName;
        console.log("Affichage du toast de succ\xE8s pour:", fullName);
        toast.success("Inscription r\xE9ussie ! \u{1F389}", {
          description: `Bienvenue ${fullName} ! Vous pouvez maintenant vous connecter.`,
          duration: 5e3
        });
        setTimeout(() => {
          router.push("/login");
        }, 2e3);
      } catch (e) {
        console.error("Erreur inscription:", e);
        const rawMessage = ((_d = e.data) == null ? void 0 : _d.message) || e.message || "";
        let userMessage = "Une erreur est survenue lors de l'inscription.";
        if (rawMessage.includes("email") && rawMessage.includes("exists")) {
          userMessage = "Cette adresse email est d\xE9j\xE0 utilis\xE9e.";
        } else if (rawMessage.includes("phone") && rawMessage.includes("exists")) {
          userMessage = "Ce num\xE9ro de t\xE9l\xE9phone est d\xE9j\xE0 utilis\xE9.";
        } else if (rawMessage) {
          userMessage = rawMessage;
        }
        toast.error("\xC9chec de l'inscription", {
          description: userMessage,
          duration: 5e3,
          action: {
            label: "R\xE9essayer",
            onClick: () => {
            }
          }
        });
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background" }, _attrs))} data-v-3c9f4f80><div class="relative flex flex-col h-full bg-background z-10 border-r-4 border-primary/20" data-v-3c9f4f80><div class="flex items-center justify-between p-6" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 hover:opacity-80 transition-opacity"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-10 w-10 object-contain" data-v-3c9f4f80${_scopeId}><span class="font-bold text-xl tracking-tight" data-v-3c9f4f80${_scopeId}>CasaNayo</span>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-10 w-10 object-contain"
              }),
              createVNode("span", { class: "font-bold text-xl tracking-tight" }, "CasaNayo")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="text-sm text-muted-foreground" data-v-3c9f4f80> D\xE9j\xE0 membre ? <a href="/login" class="font-semibold text-primary hover:underline" data-v-3c9f4f80>Connexion</a></div></div><div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 scrollbar-hide" data-v-3c9f4f80><div class="w-full max-w-[500px] mx-auto pb-20" data-v-3c9f4f80><div class="flex items-center gap-4 mb-8" data-v-3c9f4f80><div class="flex items-center gap-2" data-v-3c9f4f80><div class="${ssrRenderClass([currentStep.value >= 1 ? "border-primary bg-primary text-white" : "border-muted text-muted-foreground", "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"])}" data-v-3c9f4f80> 1 </div><span class="${ssrRenderClass([currentStep.value >= 1 ? "text-foreground" : "text-muted-foreground", "text-sm font-medium"])}" data-v-3c9f4f80>Infos</span></div><div class="h-px bg-border flex-1" data-v-3c9f4f80></div><div class="flex items-center gap-2" data-v-3c9f4f80><div class="${ssrRenderClass([currentStep.value >= 2 ? "border-primary bg-primary text-white" : "border-muted text-muted-foreground", "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"])}" data-v-3c9f4f80> 2 </div><span class="${ssrRenderClass([currentStep.value >= 2 ? "text-foreground" : "text-muted-foreground", "text-sm font-medium"])}" data-v-3c9f4f80>R\xF4le</span></div></div><h1 class="text-3xl font-black tracking-tight mb-2" data-v-3c9f4f80>${ssrInterpolate(currentStep.value === 1 ? "Qui \xEAtes-vous ?" : "Votre profil")}</h1><p class="text-muted-foreground mb-8" data-v-3c9f4f80>${ssrInterpolate(currentStep.value === 1 ? "Commen\xE7ons par les pr\xE9sentations." : "Choisissez comment vous souhaitez utiliser CasaNayo.")}</p><div class="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500" style="${ssrRenderStyle(currentStep.value === 1 ? null : { display: "none" })}" data-v-3c9f4f80><div class="grid grid-cols-2 gap-4" data-v-3c9f4f80><div class="space-y-2" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pr\xE9nom`);
          } else {
            return [
              createTextVNode("Pr\xE9nom")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.firstName,
        "onUpdate:modelValue": ($event) => form.value.firstName = $event,
        placeholder: "Baka",
        class: "h-11"
      }, null, _parent));
      _push(`</div><div class="space-y-2" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Nom`);
          } else {
            return [
              createTextVNode("Nom")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.lastName,
        "onUpdate:modelValue": ($event) => form.value.lastName = $event,
        placeholder: "Phambu",
        class: "h-11"
      }, null, _parent));
      _push(`</div></div><div class="space-y-2" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Email `);
          } else {
            return [
              createTextVNode("Email ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(Mail), { class: "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.email,
        "onUpdate:modelValue": ($event) => form.value.email = $event,
        type: "email",
        class: "pl-9 h-11",
        placeholder: "baka@example.com"
      }, null, _parent));
      _push(`</div></div><div class="space-y-2" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Mot de passe`);
          } else {
            return [
              createTextVNode("Mot de passe")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(Lock), { class: "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.password,
        "onUpdate:modelValue": ($event) => form.value.password = $event,
        type: showPassword.value ? "text" : "password",
        class: "pl-9 h-11 pr-10",
        placeholder: "Votre mot de passe"
      }, null, _parent));
      _push(`<button type="button" class="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors" data-v-3c9f4f80>`);
      if (!showPassword.value) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4" }, null, _parent));
      }
      _push(`</button></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-3c9f4f80><div class="space-y-2" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`T\xE9l\xE9phone`);
          } else {
            return [
              createTextVNode("T\xE9l\xE9phone")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2" data-v-3c9f4f80><div class="relative w-[80px]" data-v-3c9f4f80><select class="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-xl text-center ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer" data-v-3c9f4f80><!--[-->`);
      ssrRenderList(countryCodes, (c) => {
        _push(`<option${ssrRenderAttr("value", c.code)} data-v-3c9f4f80${ssrIncludeBooleanAttr(Array.isArray(selectedCallingCode.value) ? ssrLooseContain(selectedCallingCode.value, c.code) : ssrLooseEqual(selectedCallingCode.value, c.code)) ? " selected" : ""}>${ssrInterpolate(c.flag)}</option>`);
      });
      _push(`<!--]--></select></div><div class="relative flex-1" data-v-3c9f4f80><div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" data-v-3c9f4f80><span class="text-sm text-muted-foreground" data-v-3c9f4f80>${ssrInterpolate(selectedCallingCode.value)}</span></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.phoneNumber,
        "onUpdate:modelValue": ($event) => form.value.phoneNumber = $event,
        class: "h-11 pl-12",
        placeholder: "81..."
      }, null, _parent));
      _push(`</div></div></div><div class="space-y-2 relative" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ville`);
          } else {
            return [
              createTextVNode("Ville")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(MapPin), { class: "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: form.value.city,
        "onUpdate:modelValue": ($event) => form.value.city = $event,
        class: "pl-9 h-11",
        placeholder: "Rechercher une ville...",
        onFocus: ($event) => showCitySuggestions.value = true,
        onBlur: hideSuggestions,
        onInput: filterCities
      }, null, _parent));
      _push(`</div>`);
      if (showCitySuggestions.value && filteredCities.value.length > 0) {
        _push(`<div class="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md" data-v-3c9f4f80><!--[-->`);
        ssrRenderList(filteredCities.value, (city) => {
          _push(`<div class="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer" data-v-3c9f4f80>`);
          _push(ssrRenderComponent(unref(MapPin), { class: "mr-2 h-4 w-4 opacity-50" }, null, _parent));
          _push(` ${ssrInterpolate(city)}</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500" style="${ssrRenderStyle(currentStep.value === 2 ? null : { display: "none" })}" data-v-3c9f4f80><div class="${ssrRenderClass([isLocataire.value ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border", "group cursor-pointer rounded-2xl border p-4 transition-all hover:bg-muted/30 relative overflow-hidden"])}" data-v-3c9f4f80><div class="flex items-center gap-4 relative z-10" data-v-3c9f4f80><div class="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(unref(User), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div class="flex-1" data-v-3c9f4f80><div class="flex items-center justify-between" data-v-3c9f4f80><h4 class="font-bold text-lg" data-v-3c9f4f80>Locataire</h4>`);
      if (isLocataire.value) {
        _push(`<div class="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm scale-110 transition-transform" data-v-3c9f4f80>`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-4 w-4" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-sm text-muted-foreground" data-v-3c9f4f80>Je cherche \xE0 louer un bien immobilier.</p></div></div></div><div class="space-y-4" data-v-3c9f4f80><h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2" data-v-3c9f4f80><span class="w-8 h-px bg-border" data-v-3c9f4f80></span> Propri\xE9taire <span class="flex-1 h-px bg-border" data-v-3c9f4f80></span></h4><div class="grid grid-cols-1 md:grid-cols-3 gap-3" data-v-3c9f4f80><!--[-->`);
      ssrRenderList(proprietaires, (prop) => {
        _push(`<div class="${ssrRenderClass([selectedProprietaire.value === prop.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card border-border", "cursor-pointer border rounded-2xl p-4 text-center transition-all hover:border-primary/50 relative group"])}" data-v-3c9f4f80>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(prop.icon), { class: "h-6 w-6 mx-auto mb-2 text-primary" }, null), _parent);
        _push(`<span class="font-bold text-sm block" data-v-3c9f4f80>${ssrInterpolate(prop.name)}</span>`);
        if (selectedProprietaire.value === prop.id) {
          _push(`<div class="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" data-v-3c9f4f80></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (isLocataire.value && selectedProprietaire.value) {
        _push(`<p class="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200 text-center" data-v-3c9f4f80> Note : S\xE9lectionner un r\xF4le Propri\xE9taire d\xE9sactivera le r\xF4le Locataire. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-4" data-v-3c9f4f80><div class="flex items-center justify-between" data-v-3c9f4f80><h4 class="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 w-full" data-v-3c9f4f80><span class="w-8 h-px bg-border" data-v-3c9f4f80></span> Prestataire <span class="flex-1 h-px bg-border" data-v-3c9f4f80></span></h4>`);
      if (selectedPrestataire.value) {
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "ghost",
          size: "sm",
          class: "h-6 text-xs text-destructive hover:bg-destructive/10",
          onClick: ($event) => selectedPrestataire.value = null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retirer`);
            } else {
              return [
                createTextVNode("Retirer")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin" data-v-3c9f4f80><!--[-->`);
      ssrRenderList(prestataires, (serv) => {
        _push(`<div class="${ssrRenderClass([selectedPrestataire.value === serv.id ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "bg-card border-border hover:bg-muted/40", "cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center transition-all hover:border-primary/50 h-24"])}" data-v-3c9f4f80>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(serv.icon), {
          class: ["h-5 w-5", selectedPrestataire.value === serv.id ? "text-white" : "text-muted-foreground"]
        }, null), _parent);
        _push(`<span class="text-xs font-semibold leading-tight" data-v-3c9f4f80>${ssrInterpolate(serv.name)}</span></div>`);
      });
      _push(`<!--]--></div></div></div></div></div><div class="p-6 border-t bg-background/80 backdrop-blur-sm z-20" data-v-3c9f4f80><div class="w-full max-w-[500px] mx-auto flex items-center justify-between gap-4" data-v-3c9f4f80>`);
      if (currentStep.value === 2) {
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "outline",
          size: "lg",
          onClick: prevStep,
          class: "rounded-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
              _push2(` Retour `);
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4 mr-2" }),
                createTextVNode(" Retour ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentStep.value === 1) {
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          size: "lg",
          class: "w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20",
          disabled: !isInfoValid.value,
          onClick: nextStep
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 ml-2" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Suivant "),
                createVNode(unref(ChevronRight), { class: "h-4 w-4 ml-2" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          size: "lg",
          class: "w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90",
          disabled: !isRoleValid.value || isLoading.value,
          onClick: handleRegister
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isLoading.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(isLoading.value ? "Cr\xE9ation..." : "Terminer l'inscription")}`);
            } else {
              return [
                isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-4 w-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(isLoading.value ? "Cr\xE9ation..." : "Terminer l'inscription"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div><div class="text-center text-xs text-muted-foreground mt-4" data-v-3c9f4f80> En continuant, vous acceptez nos <a href="/terms" class="underline hover:text-primary" data-v-3c9f4f80>Conditions d&#39;utilisation</a>. </div></div></div><div class="hidden bg-muted lg:block relative overflow-hidden" data-v-3c9f4f80><div class="absolute inset-0 bg-primary/90 mix-blend-multiply z-10" data-v-3c9f4f80></div><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&amp;w=2653&amp;auto=format&amp;fit=crop" alt="Modern Architecture" class="absolute inset-0 h-full w-full object-cover grayscale opacity-60" data-v-3c9f4f80><div class="relative z-20 flex h-full flex-col justify-between p-12 text-white" data-v-3c9f4f80>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-bold text-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-8 w-8 object-contain" data-v-3c9f4f80${_scopeId}> CasaNayo `);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-8 w-8 object-contain"
              }),
              createTextVNode(" CasaNayo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4 max-w-lg" data-v-3c9f4f80><blockquote class="text-2xl font-medium leading-snug" data-v-3c9f4f80> \u201CCasaNayo centralise l\u2019ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services \xE0 domicile.\u201D </blockquote><div class="flex items-center gap-4" data-v-3c9f4f80><div class="font-semibold text-sm" data-v-3c9f4f80>L&#39;\xE9quipe CasaNayo</div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c9f4f80"]]);

export { index as default };
//# sourceMappingURL=index-C4wzaMHL.mjs.map
