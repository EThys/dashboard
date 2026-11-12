import { c as defineEventHandler, e as setHeader } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const appleAppSiteAssociation = defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/json");
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: "869X37PW2M.com.casa.casa.casa",
          paths: ["/open/*", "/open/*/*"]
        }
      ]
    }
  };
});

export { appleAppSiteAssociation as default };
//# sourceMappingURL=apple-app-site-association.mjs.map
