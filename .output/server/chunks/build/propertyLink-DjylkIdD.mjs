import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';

function propertyPublicPath(id, kind) {
  const token = encodeId(id);
  const normalized = normalizeListingKind(kind);
  if (!normalized || normalized === "property") return `/properties/${token}`;
  return `/properties/${token}?kind=${normalized}`;
}
function normalizeListingKind(kind) {
  const value = String(kind != null ? kind : "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (!value || value === "property" || value === "residentiel" || value === "standard") return "property";
  if (value === "hotel" || value === "hotels" || value === "chambre") return "hotel";
  if (value === "festive" || value === "fete" || value === "salle de fete") return "festive";
  if (value === "funeraire" || value === "funerailles") return "funeraire";
  if (value === "bureau" || value === "bureaux") return "bureau";
  if (value === "terrain" || value === "terrains") return "terrain";
  return null;
}

export { normalizeListingKind as n, propertyPublicPath as p };
//# sourceMappingURL=propertyLink-DjylkIdD.mjs.map
