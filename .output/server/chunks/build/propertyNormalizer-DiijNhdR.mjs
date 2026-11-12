import { g as getPublicTransactionBadgeLabel } from './transactionDisplay-GAAD372w.mjs';

function getQualityIndicator(value) {
  if (value >= 80) return "Excellent";
  if (value >= 60) return "Bon";
  if (value >= 40) return "Moyen";
  if (value >= 20) return "Faible";
  return "Tr\xE8s faible";
}
function getQualityColor(value) {
  if (value >= 80) return "text-green-600";
  if (value >= 60) return "text-blue-600";
  if (value >= 40) return "text-yellow-600";
  if (value >= 20) return "text-orange-600";
  return "text-red-600";
}
function cleanPlacePart(value) {
  return String(value != null ? value : "").trim();
}
function formatListingPlace(source) {
  if (!source) return "";
  const text = (value) => {
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    return "";
  };
  return joinPlaceParts([
    text(source.address),
    text(source.quartierValue),
    text(source.communeValue),
    text(source.cityValue),
    text(source.countryValue)
  ]);
}
function joinPlaceParts(parts) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const part of parts) {
    const text = cleanPlacePart(part);
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out.join(", ");
}
function absorbPlace(target, source) {
  var _a, _b, _c;
  if (!source || typeof source !== "object") return;
  target.streetAddress = target.streetAddress || cleanPlacePart(source.address);
  target.quartier = target.quartier || cleanPlacePart(source.quartierValue) || cleanPlacePart((_a = source.quartier) == null ? void 0 : _a.name);
  target.commune = target.commune || cleanPlacePart(source.communeValue) || cleanPlacePart((_b = source.commune) == null ? void 0 : _b.name);
  target.city = target.city || cleanPlacePart(source.cityValue) || cleanPlacePart((_c = source.city) == null ? void 0 : _c.name);
  target.country = target.country || cleanPlacePart(source.countryValue);
}
function extractPlace(item) {
  const place = {
    streetAddress: "",
    quartier: "",
    commune: "",
    city: "",
    country: "",
    location: "",
    fullAddress: ""
  };
  absorbPlace(place, item.address);
  absorbPlace(place, item.localAddress);
  if ("hotel" in item) absorbPlace(place, item.hotel);
  if ("funeraire" in item) absorbPlace(place, item.funeraire);
  if ("terrain" in item) absorbPlace(place, item.terrain);
  if ("bureau" in item) absorbPlace(place, item.bureau);
  if ("festive" in item) absorbPlace(place, item.festive);
  if ("property" in item) absorbPlace(place, item.property);
  place.location = joinPlaceParts([place.quartier, place.commune, place.city]) || place.country || "RDC";
  place.fullAddress = joinPlaceParts([
    place.streetAddress,
    place.quartier,
    place.commune,
    place.city,
    place.country
  ]) || place.location;
  return place;
}
function extractImages(item) {
  const images = [];
  if ("images" in item && Array.isArray(item.images)) {
    item.images.forEach((img) => {
      if (img.path) images.push(img.path);
      if (img.publicPath) images.push(img.publicPath);
    });
  }
  if ("images" in item && item.images && typeof item.images === "object" && !Array.isArray(item.images)) {
    const propImages = item.images;
    if (propImages.main) propImages.main.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.room) propImages.room.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.living) propImages.living.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.kitchen) propImages.kitchen.forEach((img) => img.publicPath && images.push(img.publicPath));
  }
  if ("hotel" in item && item.hotel.image) {
    images.push(item.hotel.image);
  }
  return [...new Set(images)].filter(Boolean);
}
function normalizeBureau(item) {
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.bureau.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  if (item.bureau.equip) features.push("\xC9quip\xE9");
  return {
    id: item.bureau.id,
    title: item.bureau.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: priceDisplay,
    frequency: "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: true,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: item.bureau.roomMeet,
    numberPiece: item.bureau.numberPiece,
    isEquipped: item.bureau.equip,
    sold: !!item.bureau.sold,
    area: "",
    type: "Bureau",
    transactionType: item.bureau.transactionType,
    status: getPublicTransactionBadgeLabel(item.bureau.transactionType),
    description: item.bureau.description,
    electricity: item.bureau.electric,
    electricityInfo: getQualityIndicator(item.bureau.electric),
    electricityColor: getQualityColor(item.bureau.electric),
    water: item.bureau.water,
    waterInfo: getQualityIndicator(item.bureau.water),
    waterColor: getQualityColor(item.bureau.water),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.bureau.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeFestive(item) {
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.festive.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  if (item.festive.pisteDanse) features.push("Piste de danse");
  if (item.festive.decore) features.push("D\xE9cor\xE9");
  return {
    id: item.festive.id,
    title: item.festive.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: priceDisplay,
    frequency: "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: true,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: true,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: item.festive.capacityPeople,
    roomMeet: 0,
    numberPiece: 0,
    sold: !!item.festive.sold,
    area: "",
    type: "Salle de f\xEAte",
    transactionType: item.festive.transactionType,
    status: getPublicTransactionBadgeLabel(item.festive.transactionType),
    description: item.festive.description,
    electricity: Number(item.festive.electric) || 0,
    electricityInfo: getQualityIndicator(Number(item.festive.electric) || 0),
    electricityColor: getQualityColor(Number(item.festive.electric) || 0),
    water: Number(item.festive.water) || 0,
    waterInfo: getQualityIndicator(Number(item.festive.water) || 0),
    waterColor: getQualityColor(Number(item.festive.water) || 0),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.festive.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeFuneraire(item) {
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.funeraire.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  const capacity = typeof item.funeraire.capacityPeople === "string" ? parseInt(item.funeraire.capacityPeople) || 0 : item.funeraire.capacityPeople || 0;
  return {
    id: item.funeraire.id,
    title: item.funeraire.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: priceDisplay,
    frequency: "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: true,
    isHotel: false,
    isTerrain: false,
    isEvent: true,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity,
    roomMeet: 0,
    numberPiece: 0,
    sold: !!item.funeraire.sold,
    area: "",
    type: "Espace fun\xE9raire",
    transactionType: item.funeraire.transactionType,
    status: getPublicTransactionBadgeLabel(item.funeraire.transactionType),
    description: item.funeraire.description,
    electricity: item.funeraire.electric,
    electricityInfo: getQualityIndicator(item.funeraire.electric),
    electricityColor: getQualityColor(item.funeraire.electric),
    water: item.funeraire.water,
    waterInfo: getQualityIndicator(item.funeraire.water),
    waterColor: getQualityColor(item.funeraire.water),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.funeraire.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeTerrain(item) {
  var _a;
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.terrain.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = ((_a = item.feature) == null ? void 0 : _a.map((f) => f.name)) || [];
  return {
    id: item.terrain.id,
    title: item.terrain.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: priceDisplay,
    frequency: "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: true,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    sold: !!item.terrain.sold,
    area: `${item.terrain.surface} m\xB2`,
    type: "Terrain",
    transactionType: item.terrain.transactionType,
    status: getPublicTransactionBadgeLabel(item.terrain.transactionType),
    description: item.terrain.description,
    electricity: 0,
    electricityInfo: "Non applicable",
    electricityColor: "text-muted-foreground",
    water: 0,
    waterInfo: "Non applicable",
    waterColor: "text-muted-foreground",
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.terrain.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function hotelChambresFromApi(item) {
  var _a;
  const rows = item.structure;
  if (!Array.isArray(rows)) return [];
  const out = [];
  for (const row of rows) {
    const c = row.chambre;
    if (!c) continue;
    const imgs = Array.isArray(row.image) ? row.image.map((im) => im.path || im.publicPath).filter(Boolean) : [];
    const deviseId = (_a = c.deviseId) != null ? _a : 2;
    out.push({
      id: c.id,
      hotelId: c.hotelId,
      title: c.title || "Chambre",
      description: c.description || "",
      price: Number(c.price) || 0,
      priceHeure: c.priceHeure,
      deviseId,
      currencyLabel: deviseId === 1 ? "CDF" : "USD",
      image: imgs[0] || "",
      images: imgs,
      numberPiece: c.numberPiece,
      available: c.available,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    });
  }
  return out;
}
function normalizeHotel(item) {
  var _a, _b, _c;
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = (_b = (_a = item.devise) == null ? void 0 : _a.code) != null ? _b : "USD";
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const hotelChambres = hotelChambresFromApi(item);
  const features = ((_c = item.feature) == null ? void 0 : _c.map((f) => f.name)) || [];
  return {
    id: item.hotel.id,
    title: item.hotel.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: "\u2014",
    hideListingPrice: true,
    frequency: "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: true,
    isTerrain: false,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    sold: !!item.hotel.sold,
    area: "",
    type: "H\xF4tel",
    transactionType: "h\xE9bergement",
    status: "H\xE9bergement",
    description: item.hotel.description,
    electricity: 0,
    electricityInfo: "Non applicable",
    electricityColor: "text-muted-foreground",
    water: 0,
    waterInfo: "Non applicable",
    waterColor: "text-muted-foreground",
    features,
    hotelChambres,
    images: images.length ? images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: hotelAgentName(item),
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: hotelPublicationDate(item)
  };
}
function hotelAgentName(item) {
  var _a, _b, _c, _d;
  const raw = item;
  const post = typeof item.postBy === "string" ? item.postBy.replace("@@", "@").trim() : "";
  if (post) return post;
  const mem = raw.member;
  if ((_a = mem == null ? void 0 : mem.fullName) == null ? void 0 : _a.trim()) return mem.fullName.trim();
  if ((_b = mem == null ? void 0 : mem.username) == null ? void 0 : _b.trim()) return mem.username.trim();
  const pub = raw.publisher;
  if ((_c = pub == null ? void 0 : pub.name) == null ? void 0 : _c.trim()) return pub.name.trim();
  const u = raw.user;
  if ((_d = u == null ? void 0 : u.username) == null ? void 0 : _d.trim()) return u.username.trim();
  return "Annonceur CasaNayo";
}
function hotelPublicationDate(item) {
  const h = item.hotel;
  const raw = h.createdAt || h.updatedAt || "";
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function normalizeStandardProperty(item) {
  var _a, _b, _c;
  const place = extractPlace(item);
  const location = place.location;
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.property.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = ((_a = item.features) == null ? void 0 : _a.map((f) => f.name)) || [];
  return {
    id: item.property.propertyId,
    title: item.property.title,
    location,
    fullAddress: place.fullAddress,
    streetAddress: place.streetAddress,
    quartier: place.quartier,
    commune: place.commune,
    city: place.city,
    country: place.country,
    price: priceDisplay,
    frequency: item.property.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: false,
    isResidential: true,
    beds: item.property.bedrooms || 0,
    baths: item.property.bathroom || 0,
    kitchen: item.property.kitchen || 0,
    livingRoom: item.property.livingRoom || 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    sold: !!item.property.sold,
    area: item.property.surface && item.property.surface > 0 ? `${item.property.surface} m\xB2` : item.property.livingRoom ? `${item.property.livingRoom} salon(s)` : "",
    type: (((_b = item.typeProperty) == null ? void 0 : _b.name) === "Apparts" ? "appartement" : (_c = item.typeProperty) == null ? void 0 : _c.name) || "Propri\xE9t\xE9",
    transactionType: item.property.transactionType,
    status: getPublicTransactionBadgeLabel(item.property.transactionType),
    description: item.property.description,
    electricity: item.property.electricity || 0,
    electricityInfo: getQualityIndicator(item.property.electricity || 0),
    electricityColor: getQualityColor(item.property.electricity || 0),
    water: item.property.water || 0,
    waterInfo: getQualityIndicator(item.property.water || 0),
    waterColor: getQualityColor(item.property.water || 0),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    guarantee: item.property.guarantee,
    createdAt: new Date(item.property.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeProperty(item) {
  if ("bureau" in item) return normalizeBureau(item);
  if ("festive" in item) return normalizeFestive(item);
  if ("funeraire" in item) return normalizeFuneraire(item);
  if ("terrain" in item) return normalizeTerrain(item);
  if ("hotel" in item) return normalizeHotel(item);
  if ("property" in item) return normalizeStandardProperty(item);
  throw new Error("Unsupported property type");
}

export { normalizeFestive as a, normalizeFuneraire as b, normalizeTerrain as c, normalizeHotel as d, normalizeStandardProperty as e, formatListingPlace as f, normalizeProperty as g, normalizeBureau as n };
//# sourceMappingURL=propertyNormalizer-DiijNhdR.mjs.map
