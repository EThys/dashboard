function firstUrlFromImageLike(value) {
  var _a, _b;
  if (value == null) return void 0;
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) return firstUrlFromImageArray(value);
  if (typeof value === "object") {
    const o = value;
    const p = (_b = (_a = o.publicPath) != null ? _a : o.path) != null ? _b : o.url;
    if (typeof p === "string" && p.trim()) return p.trim();
  }
  return void 0;
}
function firstUrlFromImageArray(arr) {
  var _a, _b;
  if (!Array.isArray(arr) || arr.length === 0) return void 0;
  for (const el of arr) {
    if (typeof el === "string" && el.trim()) return el.trim();
    if (el && typeof el === "object") {
      const o = el;
      const p = (_b = (_a = o.publicPath) != null ? _a : o.path) != null ? _b : o.url;
      if (typeof p === "string" && p.trim()) return p.trim();
    }
  }
  return void 0;
}
function firstUrlFromImagesBucket(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return void 0;
  const bucket = obj;
  const groups = ["main", "room", "living", "kitchen", "exterior", "bathroom", "other"];
  for (const g of groups) {
    const u = firstUrlFromImageArray(bucket[g]);
    if (u) return u;
  }
  return void 0;
}
function extractListingPhotoFromEntity(ent) {
  if (!ent) return void 0;
  let u = firstUrlFromImageLike(ent.propertyImage) || firstUrlFromImageArray(ent.propertyImage);
  if (u) return u;
  if (ent.images && typeof ent.images === "object" && !Array.isArray(ent.images)) {
    u = firstUrlFromImagesBucket(ent.images);
    if (u) return u;
  }
  u = firstUrlFromImageArray(ent.images);
  if (u) return u;
  if (typeof ent.image === "string" && ent.image.trim()) {
    const s = ent.image.trim();
    if (!/avatar|ui-avatars|gravatar/i.test(s)) return s;
  }
  return void 0;
}
function getReservationListingEntity(merged) {
  const keys = ["property", "terrain", "bureau", "festive", "funeraire", "hotel", "vacance", "chambre"];
  for (const k of keys) {
    const v = merged[k];
    if (v && typeof v === "object" && !Array.isArray(v)) return v;
  }
  return void 0;
}
function resolveReservationPropertyDetailId(merged) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const n = (v) => {
    if (v == null || v === "") return void 0;
    const x = typeof v === "number" ? v : parseInt(String(v), 10);
    return Number.isFinite(x) ? x : void 0;
  };
  const id = (_g = (_f = (_e = (_d = (_c = (_b = (_a = n(merged.propertyId)) != null ? _a : n(merged.terrainId)) != null ? _b : n(merged.bureauId)) != null ? _c : n(merged.festiveId)) != null ? _d : n(merged.funeraireId)) != null ? _e : n(merged.vacanceId)) != null ? _f : n(merged.chambreId)) != null ? _g : n(merged.hotelId);
  if (id != null) return id;
  const ent = getReservationListingEntity(merged);
  if (ent) {
    const fromEnt = (_j = (_i = (_h = n(ent.propertyId)) != null ? _h : n(ent.id)) != null ? _i : n(ent.terrainId)) != null ? _j : n(ent.bureauId);
    if (fromEnt != null) return fromEnt;
  }
  const prop = merged.property;
  return (_k = n(prop == null ? void 0 : prop.propertyId)) != null ? _k : n(prop == null ? void 0 : prop.id);
}
function extractProfilePhoto(userLike) {
  var _a;
  if (!userLike) return void 0;
  const candidates = [
    userLike.profilePicture,
    userLike.profile,
    userLike.images,
    userLike.avatar,
    userLike.photo
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 2) return c.trim();
  }
  const profile = userLike.profile;
  if (profile) {
    const p = (_a = profile.images) != null ? _a : profile.image;
    if (typeof p === "string" && p.trim()) return p.trim();
  }
  return void 0;
}
function pickMemberRecord(...candidates) {
  for (const v of candidates) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const o = v;
    const nestedUser = o.user;
    if (nestedUser && typeof nestedUser === "object" && !Array.isArray(nestedUser)) {
      const inner = nestedUser;
      if (inner.username != null || inner.fullName != null || inner.userId != null || inner.profile != null || inner.profilePicture != null) {
        return inner;
      }
    }
    if (o.username != null || o.fullName != null || o.userId != null || o.profile != null || o.profilePicture != null || o.name != null) {
      return o;
    }
  }
  return void 0;
}
function pickOwnerHostFromListing(ent) {
  var _a, _b;
  if (!ent) return void 0;
  return pickMemberRecord(
    ent.owner,
    ent.user,
    ent.publisher,
    ent.host,
    ent.member,
    (_a = ent.owner) == null ? void 0 : _a.user,
    (_b = ent.host) == null ? void 0 : _b.user
  );
}
function memberDisplayName(u, fallbackUserId) {
  var _a;
  if (!u) {
    if (fallbackUserId != null && Number.isFinite(fallbackUserId)) return `Membre #${fallbackUserId}`;
    return "\u2014";
  }
  const n = typeof u.fullName === "string" && u.fullName.trim() || typeof u.username === "string" && u.username.trim() || typeof u.name === "string" && u.name.trim() || [u.firstName, u.lastName].filter((x) => x != null && String(x).trim()).map(String).join(" ").trim() || "";
  if (n) return n;
  const id = typeof u.userId === "number" ? u.userId : parseInt(String((_a = u.userId) != null ? _a : ""), 10);
  if (Number.isFinite(id)) return `Membre #${id}`;
  if (fallbackUserId != null && Number.isFinite(fallbackUserId)) return `Membre #${fallbackUserId}`;
  return "\u2014";
}
function memberAvatar(u) {
  return extractProfilePhoto(u);
}

export { pickOwnerHostFromListing as a, memberDisplayName as b, firstUrlFromImageArray as c, extractProfilePhoto as d, extractListingPhotoFromEntity as e, firstUrlFromImageLike as f, getReservationListingEntity as g, memberAvatar as m, pickMemberRecord as p, resolveReservationPropertyDetailId as r };
//# sourceMappingURL=partyExtract-LSdOdPXy.mjs.map
