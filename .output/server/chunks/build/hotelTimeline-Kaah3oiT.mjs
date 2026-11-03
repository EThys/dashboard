function localToday() {
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function parseApiDay(value) {
  var _a, _b;
  if (value == null || value === "") return null;
  if (Array.isArray(value) && value.length >= 3) {
    const year = Number(value[0]);
    const month = Number(value[1]);
    const day = Number(value[2]);
    if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day);
    }
  }
  if (typeof value === "object") {
    const source = value;
    const year = Number(source.year);
    const month = Number((_a = source.monthValue) != null ? _a : source.month);
    const day = Number((_b = source.dayOfMonth) != null ? _b : source.day);
    if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day);
    }
  }
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
function dateFromMediaUrl(url) {
  const generation = url.match(/[?&]generation=(\d{13,16})/);
  const named = url.match(/_(\d{13})(?:\.\w+)?(?:\?|$)/);
  const token = (generation == null ? void 0 : generation[1]) || (named == null ? void 0 : named[1]);
  if (!token) return null;
  const numeric = Number(token);
  if (!Number.isFinite(numeric)) return null;
  const ms = token.length >= 16 ? Math.floor(numeric / 1e3) : numeric;
  const parsed = new Date(ms);
  const year = parsed.getUTCFullYear();
  if (Number.isNaN(parsed.getTime()) || year < 2020 || year > 2035) return null;
  return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
}
function formatFrDay(date) {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
function earliest(dates) {
  if (!dates.length) return null;
  return dates.reduce((left, right) => left.getTime() <= right.getTime() ? left : right);
}
function latest(dates) {
  if (!dates.length) return null;
  return dates.reduce((left, right) => left.getTime() >= right.getTime() ? left : right);
}
function publishedOn(input) {
  const apiCreated = instantFromApi(input.createdAt);
  const today = localToday();
  if (apiCreated && !sameDay(apiCreated, today)) return apiCreated;
  const evidence = [];
  for (const url of input.imageUrls || []) {
    const found = dateFromMediaUrl(url);
    if (found) evidence.push(found);
  }
  for (const value of input.extraDates || []) {
    const found = parseApiDay(value);
    if (found) evidence.push(found);
  }
  const older = evidence.filter((date) => date.getTime() < today.getTime());
  if (older.length) return earliest(older);
  return apiCreated || earliest(evidence);
}
function instantFromApi(value) {
  if (typeof value === "string" && value.includes("T")) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return parseApiDay(value);
}
function hotelTimeline(input) {
  const evidence = [];
  for (const url of input.imageUrls) {
    const found = dateFromMediaUrl(url);
    if (found) evidence.push(found);
  }
  for (const value of input.roomDates) {
    const found = parseApiDay(value);
    if (found) evidence.push(found);
  }
  const today = localToday();
  const apiCreated = parseApiDay(input.createdAt);
  const apiUpdated = parseApiDay(input.updatedAt);
  const older = evidence.filter((date) => date.getTime() < today.getTime());
  const apiCreatedIsToday = !!apiCreated && sameDay(apiCreated, today);
  const apiUpdatedIsToday = !!apiUpdated && sameDay(apiUpdated, today);
  const createdDate = apiCreatedIsToday && older.length ? earliest(older) : earliest([...apiCreated ? [apiCreated] : [], ...evidence]);
  const updatedDate = apiUpdatedIsToday && older.length ? latest(older) : latest([...apiUpdated ? [apiUpdated] : [], ...evidence]);
  const createdLabel = formatFrDay(createdDate);
  const updatedLabel = updatedDate && createdDate && sameDay(updatedDate, createdDate) ? "" : formatFrDay(updatedDate);
  return { createdLabel, updatedLabel };
}

export { publishedOn as a, dateFromMediaUrl as d, hotelTimeline as h, parseApiDay as p };
//# sourceMappingURL=hotelTimeline-Kaah3oiT.mjs.map
