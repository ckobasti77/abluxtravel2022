import type { Metadata } from "next";
import AuthPortal from "../../components/auth-portal";
import { getNextPath, resolveSearchParams, type PageSearchParams } from "../../lib/auth-routing";
import { SITE_NAME } from "../../lib/seo";

type SignUpPageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

export const metadata: Metadata = {
  title: `Registracija | ${SITE_NAME}`,
  description: "Registracija korisnika na ABLux Travel portal.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/signup",
  },
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await resolveSearchParams(searchParams);
  return <AuthPortal defaultMode="signup" nextPath={getNextPath(params)} />;
}

