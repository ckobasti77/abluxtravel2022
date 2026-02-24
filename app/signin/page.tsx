import type { Metadata } from "next";
import AuthPortal from "../../components/auth-portal";
import { getNextPath, resolveSearchParams, type PageSearchParams } from "../../lib/auth-routing";
import { SITE_NAME } from "../../lib/seo";

type SignInPageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

export const metadata: Metadata = {
  title: `Prijava | ${SITE_NAME}`,
  description: "Prijava korisnika na ABLux Travel portal.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/signin",
  },
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await resolveSearchParams(searchParams);
  return <AuthPortal defaultMode="signin" nextPath={getNextPath(params)} />;
}

