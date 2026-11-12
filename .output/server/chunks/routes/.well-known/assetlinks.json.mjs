import { c as defineEventHandler, e as setHeader } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const assetlinks_json = defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/json");
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.casa.casa.casa",
        sha256_cert_fingerprints: [
          "0B:FD:B7:83:80:FE:C4:EF:B9:1C:4F:C1:13:B1:30:C9:F1:67:40:2B:84:36:97:82:C0:76:82:65:35:30:92:96",
          "CC:7F:EC:C3:D5:4B:9A:DB:1E:6E:DD:80:CC:2F:93:F8:B3:BB:CF:F7:E8:31:2E:C2:D0:66:D4:40:4A:C1:17:07"
        ]
      }
    }
  ];
});

export { assetlinks_json as default };
//# sourceMappingURL=assetlinks.json.mjs.map
