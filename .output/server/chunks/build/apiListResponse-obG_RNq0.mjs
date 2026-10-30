function reloadNuxtApp(options = {}) {
  {
    return;
  }
}
function unwrapArrayPayload(raw) {
  var _a, _b, _c, _d;
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];
  const o = raw;
  const inner = (_d = (_c = (_b = (_a = o.data) != null ? _a : o.bureaux) != null ? _b : o.hotels) != null ? _c : o.properties) != null ? _d : o.results;
  if (Array.isArray(inner)) return inner;
  return [];
}

export { reloadNuxtApp as r, unwrapArrayPayload as u };
//# sourceMappingURL=apiListResponse-obG_RNq0.mjs.map
