import AuthPortal from "../../components/auth-portal";
import { getNextPath, resolveSearchParams, type PageSearchParams } from "../../lib/auth-routing";

type SignInPageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await resolveSearchParams(searchParams);
  return <AuthPortal defaultMode="signin" nextPath={getNextPath(params)} />;
}

