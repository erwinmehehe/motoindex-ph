# MotoIndex AdSense explicit opt-in — operator acceptance

This PR removes the silent AdSense client and publisher fallbacks. Advertising no longer loads unless the build is explicitly configured with both `NEXT_PUBLIC_ADSENSE_ENABLED=true` and a valid `NEXT_PUBLIC_ADSENSE_CLIENT_ID`. The `ads.txt` route requires an explicitly configured `ADSENSE_PUBLISHER_ID`; with no verified publisher it responds 404 rather than declaring an unapproved advertising account.

## Before activating advertising
1. Identify and verify ownership and authorization of the **actual MotoIndex** AdSense publisher account, client ID, `ads.txt` seller relationship and intended domains. Never copy a hardcoded account as proof of authorization.
2. Review applicable regional advertising consent, cookie and privacy notices. Confirm CSP and browser behavior for third-party resources.
3. Do not enable advertising on private account, garage, buyer quote-status, token, admin or API routes. The client loader checks the same public-route filter as analytics. Browser script objects can still persist after single-page navigation; verify actual requests on **public → private → public** navigations and direct private-route loads in a staging browser before activation.
4. Confirm there is no hidden auto-enabled setting in the provider account or app. If approved, configure `NEXT_PUBLIC_ADSENSE_ENABLED=true` and the vetted client ID **at build time**, along with the approved publisher ID where the `ads.txt` route is served.
5. Review the impact on existing monetization: changing from legacy implicit loading to explicit opt-in may pause ads upon future deployment. Do not activate blindly or count green CI as evidence of provider approval.
6. Keep issue #466 open until account-level evidence and runtime consent/network checks are documented.

No changes to Cloudflare or AdSense accounts were made. This code cannot delete historical tracking data and does not launch a production deployment.
