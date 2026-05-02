function getCurrencyLabel(code) {
  const labels = {
    "USD": "Dollars am\xE9ricains",
    "FC": "Franc congolais",
    "CDF": "Franc congolais"
  };
  return labels[code] || code;
}
function getCurrencyInfo(code) {
  const info = {
    "USD": {
      symbol: "$",
      label: "Dollars am\xE9ricains",
      position: "after"
    },
    "FC": {
      symbol: "FC",
      label: "Franc congolais",
      position: "after"
    },
    "CDF": {
      symbol: "FC",
      label: "Franc congolais",
      position: "after"
    }
  };
  return info[code] || {
    symbol: code,
    label: code,
    position: "after"
  };
}
function formatCurrency(amount, currencyCode) {
  if (amount === null || amount === void 0 || amount === "") {
    const info2 = getCurrencyInfo(currencyCode);
    return info2.position === "before" ? `${info2.symbol}0` : `0${info2.symbol}`;
  }
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    const info2 = getCurrencyInfo(currencyCode);
    return info2.position === "before" ? `${info2.symbol}0` : `0${info2.symbol}`;
  }
  const formattedAmount = numAmount.toLocaleString("fr-FR");
  const info = getCurrencyInfo(currencyCode);
  if (info.position === "before") {
    return `${info.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${info.symbol}`;
  }
}

export { formatCurrency as f, getCurrencyLabel as g };
//# sourceMappingURL=currency-BoakoUK-.mjs.map
