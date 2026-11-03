const ROLE_LABELS = {
  locataire: "Locataire",
  bailleur: "Bailleur",
  gerant: "G\xE9rant",
  commissionnaire: "Commissionnaire",
  proprietaire: "Propri\xE9taire",
  prestataire: "Prestataire",
  "prestataire de service": "Prestataire",
  client: "Locataire",
  admin: "Admin",
  superadmin: "Super admin"
};
function prettyAccountName(raw) {
  const text = String(raw != null ? raw : "").trim();
  if (!text || text === "null") return "";
  const key = text.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), "");
  return ROLE_LABELS[key] || text.charAt(0).toUpperCase() + text.slice(1);
}
function accountTypeLabel(member) {
  var _a, _b;
  const accounts = member == null ? void 0 : member.accounts;
  if (!Array.isArray(accounts) || accounts.length === 0) return "\u2014";
  const labels = [];
  for (const acc of accounts) {
    if (!acc || typeof acc !== "object") continue;
    const row = acc;
    const nested = row.account && typeof row.account === "object" ? row.account : row;
    const name = nested.name || nested.Name || ((_a = nested.typeAccount) == null ? void 0 : _a.name) || ((_b = nested.typeAccount) == null ? void 0 : _b.Name);
    const label = prettyAccountName(name);
    if (label && !labels.includes(label)) labels.push(label);
  }
  return labels.length ? labels.join(", ") : "\u2014";
}
function firstDate(...values) {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (!text || text === "null") continue;
    return value;
  }
  return null;
}
function registrationLabel(user, member) {
  const raw = firstDate(
    user == null ? void 0 : user.createdStart,
    user == null ? void 0 : user.createdAt,
    user == null ? void 0 : user.dateCreated,
    user == null ? void 0 : user.createdDate,
    user == null ? void 0 : user.registrationDate,
    user == null ? void 0 : user.dateInscription,
    member == null ? void 0 : member.createdStart,
    member == null ? void 0 : member.createdAt,
    member == null ? void 0 : member.dateCreated,
    member == null ? void 0 : member.createdDate,
    member == null ? void 0 : member.registrationDate
  );
  if (!raw) return "Non renseign\xE9e";
  const date = new Date(String(raw));
  if (Number.isNaN(date.getTime())) return String(raw);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export { accountTypeLabel as a, registrationLabel as r };
//# sourceMappingURL=userAccount-cLuxjLEr.mjs.map
