import { w as defineNuxtRouteMiddleware, l as useAuthStore, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const certificationCheck = defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated && authStore.user) {
    if (!authStore.user.certified) {
      if (to.path !== "/compte/certification-requise" && to.path !== "/login") {
        return navigateTo("/compte/certification-requise");
      }
    }
  }
});

export { certificationCheck as default };
//# sourceMappingURL=certification-check-B6NmgmRv.mjs.map
