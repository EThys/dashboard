const SALT = 45821;
const encodeId = (id) => {
  const numericId = typeof id === "string" ? parseInt(id) : id;
  if (isNaN(numericId)) return String(id);
  return (numericId + SALT).toString(36).toUpperCase();
};
const decodeId = (encoded) => {
  try {
    const decoded = parseInt(encoded.toLowerCase(), 36) - SALT;
    return isNaN(decoded) ? 0 : decoded;
  } catch {
    return 0;
  }
};

export { decodeId as d, encodeId as e };
//# sourceMappingURL=urlObfuscator-B34PnJ0V.mjs.map
