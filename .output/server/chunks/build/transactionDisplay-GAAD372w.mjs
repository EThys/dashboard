function isLodgingTransactionType(t) {
  const s = String(t != null ? t : "").toLowerCase();
  return s.includes("h\xE9berg") || s.includes("heberg") || s.includes("hotel") || s.includes("h\xF4tel");
}
function isLocationTransactionType(t) {
  const s = String(t != null ? t : "vente").toLowerCase();
  return s.includes("location") || s.includes("louer");
}
function getPublicTransactionBadgeLabel(t) {
  if (isLodgingTransactionType(t)) return "H\xE9bergement";
  return isLocationTransactionType(t) ? "Location" : "Vente";
}

export { isLodgingTransactionType as a, getPublicTransactionBadgeLabel as g, isLocationTransactionType as i };
//# sourceMappingURL=transactionDisplay-GAAD372w.mjs.map
