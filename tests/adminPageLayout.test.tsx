import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ headers: vi.fn(), access: vi.fn() }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_NOT_FOUND"); },
}));
vi.mock("@/lib/privilegedApiAccess", () => ({
  requirePrivilegedApiAccess: mocks.access,
}));

import AdminLayout from "../app/admin/layout";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.headers.mockResolvedValue(new Headers());
});

describe("admin layout defense-in-depth", () => {
  it("never renders private admin children when the inner access gate denies", async () => {
    mocks.access.mockResolvedValue(new Response(null, { status: 403 }));
    await expect(AdminLayout({ children: "private dealer leads" })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.access).toHaveBeenCalledOnce();
  });

  it("renders the authorized admin view only after the independent gate passes", async () => {
    mocks.access.mockResolvedValue(null);
    const content = await AdminLayout({ children: "approved dashboard" });
    expect(content.props.children).toBe("approved dashboard");
    expect(mocks.access).toHaveBeenCalledOnce();
  });
});
