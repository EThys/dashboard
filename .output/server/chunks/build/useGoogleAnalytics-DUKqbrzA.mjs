import { c as useRuntimeConfig } from './server.mjs';

let cachedMeasurementId = "";
function gaMeasurementId() {
  if (cachedMeasurementId) return cachedMeasurementId;
  const config = useRuntimeConfig();
  cachedMeasurementId = String(config.public.gaMeasurementId || "").trim();
  return cachedMeasurementId;
}
function trackListingView(input) {
  gaMeasurementId();
  return;
}

export { gaMeasurementId as g, trackListingView as t };
//# sourceMappingURL=useGoogleAnalytics-DUKqbrzA.mjs.map
