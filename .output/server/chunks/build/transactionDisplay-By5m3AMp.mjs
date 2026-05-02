function isLocationTransactionType(t) {
  const s = String(t != null ? t : "vente").toLowerCase();
  return s.includes("location") || s.includes("louer");
}
function getPublicTransactionBadgeLabel(t) {
  return isLocationTransactionType(t) ? "Location" : "Vente";
}

export { getPublicTransactionBadgeLabel as g, isLocationTransactionType as i };
//# sourceMappingURL=transactionDisplay-By5m3AMp.mjs.map
