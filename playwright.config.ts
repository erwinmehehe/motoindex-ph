import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:"./tests/e2e",
  timeout:30_000,
  retries:1,
  workers:1,
  use:{baseURL:"http://127.0.0.1:3100",trace:"retain-on-failure"},
  webServer:{
    command:"ADMIN_AUTH_MODE=cloudflare-access ADMIN_ACCESS_ALLOWED_EMAILS=admin@example.com npm run dev -- -p 3100",
    url:"http://127.0.0.1:3100",
    reuseExistingServer:false,
    timeout:120_000
  },
  projects:[{name:"chromium",use:{browserName:"chromium"}}]
});
