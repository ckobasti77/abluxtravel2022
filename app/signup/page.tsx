import AuthPortal from "../../components/auth-portal";
import { getNextPath, resolveSearchParams, type PageSearchParams } from "../../lib/auth-routing";

type SignUpPageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await resolveSearchParams(searchParams);
  return <AuthPortal defaultMode="signup" nextPath={getNextPath(params)} />;
}

