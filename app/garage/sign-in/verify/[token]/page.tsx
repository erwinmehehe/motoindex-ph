import type { Metadata } from "next";
import Link from "next/link";
import { GarageMagicLinkConfirm } from "@/components/GarageMagicLinkConfirm";
import { PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in to My Garage | MotoIndex Philippines",
  description: "Complete a MotoIndex My Garage passwordless sign-in.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function GarageVerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="page shell">
    <PageHero
      kicker="MotoIndex account"
      title="Secure sign-in"
      description="Magic links are single-use. Opening this page does not consume the link until you choose Continue."
      actions={<Link className="button ghost" href="/garage">Back to My Garage</Link>}
    />
    <GarageMagicLinkConfirm token={token} />
  </main>;
}
