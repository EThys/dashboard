import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, ref, getCurrentInstance, defineComponent, createElementBlock, shallowRef, provide, cloneVNode, h, defineAsyncComponent, computed, unref, shallowReactive, Suspense, Fragment, useSSRContext, createApp, withCtx, createVNode, toRef, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, nextTick, mergeProps, getCurrentScope } from 'vue';
import { c as createError$1, h as hasProtocol, i as isScriptProtocol, k as joinURL, w as withQuery, l as destr, m as klona, s as sanitizeStatusCode, n as getRequestHeader, o as isEqual, p as getContext, q as setCookie, r as getCookie, t as deleteCookie, $ as $fetch$1, v as createHooks, x as executeAsync, y as toRouteMatcher, z as createRouter$1, A as defu } from '../nitro/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { defineStore, setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.20.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$g = {
  layout: "default"
};
const __nuxt_page_meta$f = {
  layout: "default"
};
const __nuxt_page_meta$e = {
  layout: "empty"
};
const __nuxt_page_meta$d = {
  layout: "default"
};
const __nuxt_page_meta$c = {
  layout: "default"
};
const __nuxt_page_meta$b = {
  layout: "empty"
};
const __nuxt_page_meta$a = {
  layout: "empty"
};
const __nuxt_page_meta$9 = {
  layout: "default"
};
const __nuxt_page_meta$8 = {
  layout: "dashboard"
};
const __nuxt_page_meta$7 = {
  layout: "default"
};
const __nuxt_page_meta$6 = {
  layout: "default"
};
const __nuxt_page_meta$5 = {
  layout: "dashboard"
};
const __nuxt_page_meta$4 = {
  layout: "dashboard"
};
const __nuxt_page_meta$3 = {
  layout: "dashboard"
};
const __nuxt_page_meta$2 = {
  layout: "dashboard"
};
const __nuxt_page_meta$1 = {
  layout: "dashboard"
};
const __nuxt_page_meta = {
  layout: "dashboard"
};
const _routes = [
  {
    name: "team",
    path: "/team",
    meta: __nuxt_page_meta$g || {},
    component: () => import('./team-t9IRrcjE.mjs')
  },
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$f || {},
    component: () => import('./index-ZvV_7wpD.mjs')
  },
  {
    name: "legal",
    path: "/legal",
    component: () => import('./legal-BfdL1jzn.mjs')
  },
  {
    name: "login",
    path: "/login",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./login-hcE_g2li.mjs')
  },
  {
    name: "terms",
    path: "/terms",
    component: () => import('./terms-D-SoBR6t.mjs')
  },
  {
    name: "contact",
    path: "/contact",
    meta: __nuxt_page_meta$d || {},
    component: () => import('./contact-DUP1_QHw.mjs')
  },
  {
    name: "cookies",
    path: "/cookies",
    component: () => import('./cookies-D7Khstno.mjs')
  },
  {
    name: "privacy",
    path: "/privacy",
    component: () => import('./privacy-CCwVtrHa.mjs')
  },
  {
    name: "security",
    path: "/security",
    component: () => import('./security-CUfr9Or0.mjs')
  },
  {
    name: "test-toast",
    path: "/test-toast",
    component: () => import('./test-toast-D_S7I9zS.mjs')
  },
  {
    name: "services-id",
    path: "/services/:id()",
    meta: __nuxt_page_meta$c || {},
    component: () => import('./_id_-CWt6Ugmc.mjs')
  },
  {
    name: "booking-policy",
    path: "/booking-policy",
    component: () => import('./booking-policy-DmTTK37O.mjs')
  },
  {
    name: "register-admin",
    path: "/register/admin",
    meta: __nuxt_page_meta$b || {},
    component: () => import('./admin-BcUebZ90.mjs')
  },
  {
    name: "register",
    path: "/register",
    meta: __nuxt_page_meta$a || {},
    component: () => import('./index-Bl-HNOaG.mjs')
  },
  {
    name: "services",
    path: "/services",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./index-Dku0lQ_W.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./index-Bws0pGS3.mjs')
  },
  {
    name: "properties-id",
    path: "/properties/:id()",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./_id_-DkPwbfvb.mjs')
  },
  {
    name: "properties",
    path: "/properties",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./index-1RAYkFVl.mjs')
  },
  {
    name: "dashboard-users-id",
    path: "/dashboard/users/:id()",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./_id_-CW_dabnY.mjs')
  },
  {
    name: "dashboard-users",
    path: "/dashboard/users",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./index-BWFS7Bjy.mjs')
  },
  {
    name: "dashboard-my-reservations",
    path: "/dashboard/my-reservations",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./my-reservations-Yrz0wCeI.mjs')
  },
  {
    name: "dashboard-publications",
    path: "/dashboard/publications",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-DpY6bl3w.mjs')
  },
  {
    name: "dashboard-publications-services-id",
    path: "/dashboard/publications/services/:id()",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./_id_-CxuQ0xwP.mjs')
  },
  {
    name: "dashboard-publications-properties-id",
    path: "/dashboard/publications/properties/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-NrCYnu0w.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const useMembersStore = defineStore("members", {
  state: () => ({
    users: [],
    members: [],
    cardTypes: [],
    isLoading: false
  }),
  getters: {
    getUserById: (state) => (id) => {
      return state.users.find((u) => u.userId.toString() === id.toString());
    },
    getMemberById: (state) => (id) => {
      return state.members.find((m) => m.id.toString() === id.toString());
    },
    getMemberByUserId: (state) => (userId) => {
      return state.members.find((m) => m.userId.toString() === userId.toString());
    },
    getCardTypeName: (state) => (typeId) => {
      if (typeId === 2) return "Passeport";
      const type = state.cardTypes.find((t) => t.typeCardId === typeId);
      return type ? type.name : "Inconnu";
    }
  },
  actions: {
    setUsers(users) {
      this.users = users;
    },
    setMembers(members) {
      this.members = members;
    },
    setCardTypes(types) {
      this.cardTypes = types;
    },
    setLoading(status) {
      this.isLoading = status;
    },
    updateUserCertification(userId, status) {
      const user = this.users.find((u) => u.userId === userId);
      if (user) {
        user.certified = status;
      }
    },
    async certifyUser(userId, status) {
      const auth = useAuthStore();
      const config = /* @__PURE__ */ useRuntimeConfig();
      try {
        await $fetch(`${config.public.apiBase}/certification/${userId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${auth.token}`
          },
          body: {
            state: status
          }
        });
        this.updateUserCertification(userId, status);
        return { success: true };
      } catch (error) {
        console.error("Certification error:", error);
        return { success: false, error };
      }
    },
    reset() {
      this.users = [];
      this.members = [];
      this.isLoading = false;
    }
  }
});
const usePropertyStore = defineStore("properties", {
  state: () => ({
    properties: [],
    types: [],
    // Specific sections
    terrains: [],
    funeraires: [],
    festives: [],
    bureaux: [],
    hotels: [],
    lastFetch: null,
    typesLastFetch: null
  }),
  getters: {
    getPropertyById: (state) => (id) => {
      let found = state.properties.find((item) => {
        return item.property && String(item.property.propertyId) === String(id);
      });
      if (found) return found;
      const allCollections = [
        ...state.terrains,
        ...state.funeraires,
        ...state.festives,
        ...state.bureaux,
        ...state.hotels
      ];
      return allCollections.find((item) => {
        const p = "property" in item ? item.property : "terrain" in item ? item.terrain : "funeraire" in item ? item.funeraire : "festive" in item ? item.festive : "bureau" in item ? item.bureau : "hotel" in item ? item.hotel : null;
        if (!p) return false;
        const itemId = "id" in p ? p.id : "propertyId" in p ? p.propertyId : null;
        return String(itemId) === String(id);
      });
    },
    getTypes: (state) => state.types,
    // Getters for sections
    getTerrains: (state) => state.terrains,
    getFuneraires: (state) => state.funeraires,
    getFestives: (state) => state.festives,
    getBureaux: (state) => state.bureaux,
    getHotels: (state) => state.hotels
  },
  actions: {
    setProperties(data) {
      this.properties = data;
      this.lastFetch = /* @__PURE__ */ new Date();
    },
    setTypes(data) {
      this.types = data;
      this.typesLastFetch = /* @__PURE__ */ new Date();
    },
    async fetchTypes(apiBase) {
      if (this.types.length > 0) return;
      try {
        const data = await $fetch(`${apiBase}/property/types`, { timeout: 1e4 });
        if (data && data.data) {
          this.setTypes(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch property types", e);
      }
    },
    async fetchTerrains(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property/terrains`, { timeout: 1e4 });
        if (data && data.terrain) {
          this.terrains = data.terrain;
        }
      } catch (e) {
        console.error("Failed fetch terrains", e);
      }
    },
    async fetchFuneraires(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property/funeraires`, { timeout: 1e4 });
        if (data && data.funeraires) {
          this.funeraires = data.funeraires;
        }
      } catch (e) {
        console.error("Failed fetch funeraires", e);
      }
    },
    async fetchFestives(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property/festives`, { timeout: 1e4 });
        if (data && data.festives) {
          this.festives = data.festives;
        }
      } catch (e) {
        console.error("Failed fetch festives", e);
      }
    },
    async fetchBureaux(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property/bureaux`, { timeout: 1e4 });
        if (data && data.bureaux) {
          this.bureaux = data.bureaux;
        }
      } catch (e) {
        console.error("Failed fetch bureaux", e);
      }
    },
    async fetchHotels(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property/hotels`, { timeout: 1e4 });
        if (data && data.data) {
          this.hotels = data.data;
        }
      } catch (e) {
        console.error("Failed fetch hotels", e);
      }
    },
    async fetchProperties(apiBase) {
      try {
        const data = await $fetch(`${apiBase}/property`, { timeout: 15e3 });
        if (data && data.properties) {
          this.properties = data.properties;
          this.lastFetch = /* @__PURE__ */ new Date();
        }
      } catch (e) {
        console.error("Failed fetch properties", e);
      }
    },
    async updateProperty(id, type, updates, apiBase) {
      try {
        let targetArray = null;
        let endpoint = "";
        const normalizedType = type?.toLowerCase();
        if (normalizedType === "résidentiel" || normalizedType === "standard" || !type) {
          targetArray = this.properties;
          endpoint = `${apiBase}/property/${id}`;
        } else if (normalizedType === "terrain") {
          targetArray = this.terrains;
          endpoint = `${apiBase}/property/terrains/${id}`;
        } else if (normalizedType === "bureau") {
          targetArray = this.bureaux;
          endpoint = `${apiBase}/property/bureaux/${id}`;
        } else if (normalizedType === "espace festif") {
          targetArray = this.festives;
          endpoint = `${apiBase}/property/festives/${id}`;
        } else if (normalizedType === "espace funéraire") {
          targetArray = this.funeraires;
          endpoint = `${apiBase}/property/funeraires/${id}`;
        } else if (normalizedType === "hôtel") {
          targetArray = this.hotels;
          endpoint = `${apiBase}/property/hotels/${id}`;
        }
        if (targetArray) {
          const item = targetArray.find((i) => {
            const p = i.property || i.terrain || i.bureau || i.festive || i.funeraire || i.hotel;
            return String(p?.id || p?.propertyId) === String(id);
          });
          if (item) {
            const pKey = item.property ? "property" : item.terrain ? "terrain" : item.bureau ? "bureau" : item.festive ? "festive" : item.funeraire ? "funeraire" : "hotel";
            item[pKey] = { ...item[pKey], ...updates };
          }
        }
        if (endpoint) {
          await $fetch(endpoint, {
            method: "PATCH",
            body: updates,
            timeout: 1e4
          });
        }
        return { success: true };
      } catch (e) {
        console.error("Failed to update property", e);
        return { success: false, error: e };
      }
    },
    reset() {
      this.properties = [];
      this.types = [];
      this.terrains = [];
      this.funeraires = [];
      this.festives = [];
      this.bureaux = [];
      this.hotels = [];
      this.lastFetch = null;
      this.typesLastFetch = null;
    }
  }
});
const useServiceStore = defineStore("services", {
  state: () => ({
    services: [],
    categories: [],
    lastFetch: null,
    categoriesLastFetch: null,
    loadedCategories: /* @__PURE__ */ new Set()
  }),
  getters: {
    getServiceById: (state) => (id) => {
      return state.services.find((item) => item.prestation.id == id);
    },
    getServicesByCategoryId: (state) => (categoryId) => {
      return state.services.filter((item) => item.prestation.serviceId == categoryId);
    },
    getCategories: (state) => state.categories
  },
  actions: {
    setServices(data) {
      this.services = data;
      this.lastFetch = /* @__PURE__ */ new Date();
    },
    setCategories(data) {
      this.categories = data;
      this.categoriesLastFetch = /* @__PURE__ */ new Date();
    },
    appendServices(data) {
      const existingIds = new Set(this.services.map((s) => s.prestation.id));
      const newServices = data.filter((s) => !existingIds.has(s.prestation.id));
      this.services.push(...newServices);
    },
    async fetchCategories(apiBase) {
      if (this.categories.length > 0) return;
      try {
        const data = await $fetch(`${apiBase}/accounts`, { timeout: 1e4 });
        if (data && data.accounts) {
          const serviceProviders = data.accounts.filter((acc) => acc.typeAccount?.name === "Prestataire de service");
          this.setCategories(serviceProviders);
        }
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    },
    async fetchServicesByCategory(categoryId, apiBase) {
      try {
        const data = await $fetch(`${apiBase}/prestations`, {
          query: { serviceId: categoryId },
          timeout: 1e4
        });
        if (data && data.prestations) {
          this.appendServices(data.prestations);
          this.loadedCategories.add(categoryId);
        }
      } catch (e) {
        console.error("Failed to fetch background services", e);
      }
    },
    async updateService(id, updates, apiBase) {
      try {
        const index = this.services.findIndex((s) => s.prestation.id === id);
        if (index !== -1) {
          this.services[index].prestation = {
            ...this.services[index].prestation,
            ...updates
          };
        }
        await $fetch(`${apiBase}/prestations/${id}`, {
          method: "PATCH",
          body: updates,
          timeout: 1e4
        });
      } catch (e) {
        console.error("Failed to update service", e);
      }
    },
    async fetchServices(apiBase) {
      if (this.services.length > 0) return;
      try {
        const data = await $fetch(`${apiBase}/prestations`, { timeout: 15e3 });
        if (data && data.prestations) {
          this.setServices(data.prestations);
        }
      } catch (e) {
        console.error("Failed to fetch all services", e);
      }
    },
    reset() {
      this.services = [];
      this.categories = [];
      this.lastFetch = null;
      this.categoriesLastFetch = null;
      this.loadedCategories.clear();
    }
  }
});
const useCurrencyStore = defineStore("currency", {
  state: () => ({
    currencies: [],
    lastFetch: null
  }),
  getters: {
    getCurrencies: (state) => state.currencies,
    getCurrencyByCode: (state) => (code) => {
      return state.currencies.find((c) => c.code === code);
    },
    getSymbol: () => (code) => {
      const symbols = {
        "USD": "$",
        "CDF": "FC"
      };
      return symbols[code] || code;
    },
    getLabel: () => (code) => {
      const labels = {
        "USD": "Dollars américains",
        "CDF": "Franc congolais"
      };
      return labels[code] || code;
    },
    getExchangeRate: (state) => (code) => {
      const currency = state.currencies.find((c) => c.code === code);
      return currency?.tauxLocal || 1;
    }
  },
  actions: {
    async fetchCurrencies(apiBase) {
      try {
        const response = await $fetch(`${apiBase}/devise`);
        if (response && Array.isArray(response)) {
          this.currencies = response;
          this.lastFetch = /* @__PURE__ */ new Date();
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    },
    setCurrencies(data) {
      this.currencies = data;
      this.lastFetch = /* @__PURE__ */ new Date();
    },
    reset() {
      this.currencies = [];
      this.lastFetch = null;
    }
  }
});
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    profile: null,
    accounts: [],
    token: null,
    isAuthenticated: false
  }),
  getters: {
    isAdmin: (state) => {
      if (!state.accounts || state.accounts.length === 0) return false;
      return state.accounts.some((acc) => acc.id === 18 || acc.id === 19);
    }
  },
  actions: {
    async login(identifiant, password) {
      const config = /* @__PURE__ */ useRuntimeConfig();
      try {
        const res = await $fetch(`${config.public.authBase}/auth/login`, {
          method: "POST",
          body: { identifiant, password }
        });
        if (res?.member && res?.token) {
          this.setSession(res);
          return { success: true };
        }
        return { success: false, message: "Réponse invalide du serveur." };
      } catch (error) {
        console.error("Login error:", error);
        let msg = "Une erreur est survenue.";
        if (error.status === 401 || error.status === 403) {
          msg = "Identifiants incorrects. Veuillez vérifier vos informations.";
        } else if (error.data?.message) {
          msg = error.data.message === "Invalid credentials." ? "Identifiant ou mot de passe incorrect." : error.data.message;
        }
        return { success: false, message: msg };
      }
    },
    setSession(data) {
      this.user = data.member.user;
      this.profile = data.member.profile;
      this.accounts = data.member.accounts;
      this.token = data.token;
      this.isAuthenticated = true;
      const tokenCookie = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7, path: "/" });
      const userCookie = useCookie("auth_user", { maxAge: 60 * 60 * 24 * 7, path: "/" });
      const profileCookie = useCookie("auth_profile", { maxAge: 60 * 60 * 24 * 7, path: "/" });
      const accountsCookie = useCookie("auth_accounts", { maxAge: 60 * 60 * 24 * 7, path: "/" });
      tokenCookie.value = data.token;
      userCookie.value = data.member.user;
      profileCookie.value = data.member.profile;
      accountsCookie.value = data.member.accounts;
    },
    logout() {
      this.user = null;
      this.profile = null;
      this.accounts = [];
      this.token = null;
      this.isAuthenticated = false;
      const membersStore = useMembersStore();
      const propertyStore = usePropertyStore();
      const serviceStore = useServiceStore();
      const currencyStore = useCurrencyStore();
      membersStore.reset();
      propertyStore.reset();
      serviceStore.reset();
      currencyStore.reset();
      const tokenCookie = useCookie("auth_token", { path: "/" });
      const userCookie = useCookie("auth_user", { path: "/" });
      const profileCookie = useCookie("auth_profile", { path: "/" });
      const accountsCookie = useCookie("auth_accounts", { path: "/" });
      tokenCookie.value = null;
      userCookie.value = null;
      profileCookie.value = null;
      accountsCookie.value = null;
      return navigateTo("/login");
    },
    // Helper to check if we have a valid session on load
    checkSession() {
      const token = useCookie("auth_token").value;
      const userCookie = useCookie("auth_user").value;
      const profileCookie = useCookie("auth_profile").value;
      const accountsCookie = useCookie("auth_accounts").value;
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        if (userCookie) {
          try {
            this.user = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
          } catch (e) {
            this.user = userCookie;
          }
        }
        if (profileCookie) {
          try {
            this.profile = typeof profileCookie === "string" ? JSON.parse(profileCookie) : profileCookie;
          } catch (e) {
            this.profile = profileCookie;
          }
        }
        if (accountsCookie) {
          try {
            this.accounts = typeof accountsCookie === "string" ? JSON.parse(accountsCookie) : accountsCookie;
          } catch (e) {
            this.accounts = accountsCookie;
          }
        }
        return true;
      }
      if (this.token || this.isAuthenticated) {
        this.token = null;
        this.user = null;
        this.profile = null;
        this.accounts = [];
        this.isAuthenticated = false;
      }
      return false;
    }
  }
});
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const hasSession = auth.checkSession();
  if (to.path.startsWith("/dashboard")) {
    if (!hasSession) {
      return navigateTo("/login");
    }
    if (!auth.isAdmin) {
      console.warn("Accès refusé au Dashboard: Utilisateur non administrateur.");
      return navigateTo("/");
    }
  }
  if (to.path === "/login" && hasSession) {
    return navigateTo(auth.isAdmin ? "/dashboard" : "/");
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  auth_45global,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia;
    }
    return {
      provide: {
        pinia
      }
    };
  },
  hooks: {
    "app:rendered"() {
      const nuxtApp = useNuxtApp();
      nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
      setActivePinia(void 0);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const preference = "light";
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}).value : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  useHead({ htmlAttrs });
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.value = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const auth_ydS_uAQ5qS4E2Ez9vBX0d0JPoo00WYZNOgh9_nraCUo = /* @__PURE__ */ defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const tokenCookie = useCookie("auth_token");
  if (tokenCookie.value) {
    authStore.token = tokenCookie.value;
    authStore.isAuthenticated = true;
  }
});
const vue_query_GNtWx11mSO94O_Ctd2OG8SaawZMBzi1ne17Edj_iIOc = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueQueryPlugin);
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  auth_ydS_uAQ5qS4E2Ez9vBX0d0JPoo00WYZNOgh9_nraCUo,
  vue_query_GNtWx11mSO94O_Ctd2OG8SaawZMBzi1ne17Edj_iIOc
];
const layouts = {
  dashboard: defineAsyncComponent(() => import('./dashboard-vLlk1dVD.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-C9SMMmyT.mjs').then((m) => m.default || m)),
  empty: defineAsyncComponent(() => import('./empty-Cf3_VTIZ.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      const _component_ClientOnly = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-B99Nfh0S.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-dxzKh29_.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export { useRouter as a, usePropertyStore as b, useServiceStore as c, useRuntimeConfig as d, entry_default as default, useAuthStore as e, useRoute as f, useNuxtApp as g, nuxtLinkDefaults as h, asyncDataDefaults as i, createError as j, fetchDefaults as k, useRequestFetch as l, useMembersStore as m, navigateTo as n, resolveRouteObject as r, useHead as u };
//# sourceMappingURL=server.mjs.map
