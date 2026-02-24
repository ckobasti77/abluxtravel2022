import AuthPortal from "../../components/auth-portal";
import {
  getAuthMode,
  getNextPath,
  resolveSearchParams,
  type PageSearchParams,
} from "../../lib/auth-routing";

type AuthPageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await resolveSearchParams(searchParams);
  return <AuthPortal requestedMode={getAuthMode(params, "signin")} nextPath={getNextPath(params)} />;
}
