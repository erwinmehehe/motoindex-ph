# Apply R7 to the registry-verified launch-ready checkout

This is the cumulative MotoIndex UI/content/media/domain overlay. It intentionally excludes `package-lock.json`.

Canonical production host: `https://motoindexph.com`

1. Start from the registry-verified launch-ready MotoIndex checkout.
2. Copy this overlay over that checkout, preserving the launch-ready `package-lock.json` exactly as supplied.
3. Set `NEXT_PUBLIC_SITE_URL=https://motoindexph.com` in the production build environment.
4. Run the normal dependency install from that launch-ready checkout.
5. Run `npm run media:sync` in a networked environment to materialize the standardized local entity images.
6. Run `MEDIA_STRICT_LOCAL=1 npm run validate:media` and require zero missing local derivatives.
7. Run `npm run validate:all` and the normal launch gates.
8. Deploy `motoindexph.com` as the canonical hostname and redirect `www.motoindexph.com` to it.

Do not regenerate or hand-edit the security lockfile as part of this overlay.
