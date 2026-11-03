import { f as formatCurrency } from './currency-BoakoUK-.mjs';

function lowestHotelRoomOffer(rooms) {
  const priced = rooms.filter((room2) => {
    const amount2 = Number(room2.price);
    return Number.isFinite(amount2) && amount2 > 0 && room2.available !== false;
  });
  if (!priced.length) return null;
  priced.sort((a, b) => {
    const byPrice = Number(a.price) - Number(b.price);
    if (byPrice !== 0) return byPrice;
    return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
  });
  const room = priced[0];
  const amount = Number(room.price);
  const currencyCode = room.deviseId === 1 ? "CDF" : "USD";
  const formatted = formatCurrency(amount, currencyCode);
  return {
    amount,
    currencyCode,
    formatted,
    label: `\xC0 partir de ${formatted}`
  };
}

export { lowestHotelRoomOffer as l };
//# sourceMappingURL=hotelStartingPrice-TSwrGxRW.mjs.map
