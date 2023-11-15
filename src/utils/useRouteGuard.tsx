import { redirect } from 'next/navigation';
import { RouteGuardParams as RouteGuardProps } from '@/types';

export default function useRouteGuard({
	authenticated,
	loading,
	authenticationRoute: authenticationFallback,
	homepageRoute: homepageFallback
}: RouteGuardProps): boolean {
	if (loading) {
		return false;
	}

	if (authenticated && homepageFallback) {
		redirect(homepageFallback);
	}

	if (!authenticated && authenticationFallback) {
		redirect(authenticationFallback);
	}

	return true;
}
