import{e as o}from"./Rq-uU9KP.js";const p="https://casanayo.com";function c(e,r){const n=r&&r!=="property"?r:"property";return`${p}/open/property/${o(e)}?kind=${encodeURIComponent(n)}`}function s(e){return`${p}/open/service/${o(e)}`}function i(e,r){return`${e.map(t=>String(t??"").trim()).filter(t=>t.length>0).join(`
`)}

${r}

Retrouvez plus de détails dans l'application CasaNayo.`}function u(e,r){const n=o(e);return!r||r==="property"?`/properties/${n}`:`/properties/${n}?kind=${encodeURIComponent(r)}`}function $(e){return`/services/${o(e)}`}function l(e){return`/vacances/${o(e)}`}export{c as a,l as b,u as c,s as o,$ as p,i as s};
