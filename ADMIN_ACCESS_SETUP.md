# Admin perimeter: Cloudflare Access

MotoIndex supports two admin authentication modes.

- `basic`: local/emergency compatibility mode using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- `cloudflare-access`: production mode. Cloudflare Access must protect `/admin/*`, `/api/admin/*`, and `/api/ingestion/*` before requests reach the application.

## Production requirements

1. Create a Cloudflare Access application covering the MotoIndex admin paths.
2. Require MFA in the Access policy.
3. Restrict identity providers/users to the intended administrators.
4. Keep the application origin reachable only through the Cloudflare deployment path.
5. Set:
   - `ADMIN_AUTH_MODE=cloudflare-access`
   - `ADMIN_ACCESS_ALLOWED_EMAILS=admin1@example.com,admin2@example.com`
6. Do not rely on the application header check as a replacement for Cloudflare's JWT verification. The edge policy is the security boundary; the application check is defense in depth.

When Access mode is enabled, MotoIndex requires both `Cf-Access-Authenticated-User-Email` and `Cf-Access-Jwt-Assertion` plus an allowlisted email. Basic Auth is not accepted on those routes in Access mode.
