function cookiesToStr(cookies) {
  if (Array.isArray(cookies))
    return cookies.reduce((prev, { name, value }) => {
      if (!prev) return `${name}=${value}`;
      return `${prev}; ${name}=${value}`;
    }, "");
  return "";
}
module.exports = { cookiesToStr };
