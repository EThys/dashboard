import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';

const ORIGIN = "https://casanayo.com";
function openPropertyUrl(id, kind) {
  const safeKind = kind && kind !== "property" ? kind : "property";
  return `${ORIGIN}/open/property/${encodeId(id)}?kind=${encodeURIComponent(safeKind)}`;
}
function openServiceUrl(id) {
  return `${ORIGIN}/open/service/${encodeId(id)}`;
}
function shareMessage(details, url) {
  const body = details.map((line) => String(line != null ? line : "").trim()).filter((line) => line.length > 0).join("\n");
  return `${body}

${url}

Retrouvez plus de d\xE9tails dans l'application CasaNayo.`;
}
function publicPropertyPath(id, kind) {
  const token = encodeId(id);
  if (!kind || kind === "property") return `/properties/${token}`;
  return `/properties/${token}?kind=${encodeURIComponent(kind)}`;
}
function publicServicePath(id) {
  return `/services/${encodeId(id)}`;
}
function publicVacancePath(id) {
  return `/vacances/${encodeId(id)}`;
}

export { openPropertyUrl as a, publicVacancePath as b, publicPropertyPath as c, openServiceUrl as o, publicServicePath as p, shareMessage as s };
//# sourceMappingURL=openListingLink-UP60yfaJ.mjs.map
