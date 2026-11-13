const blank = /* @__PURE__ */ new Set(["", "string", "null", "undefined"]);
function textOf(value) {
  if (value == null) return "";
  const text = String(value).trim();
  return blank.has(text.toLowerCase()) ? "" : text;
}
function readCardNumber(...sources) {
  const keys = ["numberCard", "number_card", "cardNumber", "card_number", "numeroCarte", "numero_carte"];
  const seen = /* @__PURE__ */ new Set();
  const queue = [...sources];
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);
    const record = current;
    for (const key of keys) {
      const found = textOf(record[key]);
      if (found) return found;
    }
    for (const nested of ["person", "profile", "member", "actor"]) {
      if (record[nested]) queue.push(record[nested]);
    }
  }
  return "";
}

export { readCardNumber as r };
//# sourceMappingURL=cardNumber-j-59lBiO.mjs.map
