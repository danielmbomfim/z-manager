'use client';
import LoadComponent from '@/components/LoadComponent';
import { useAuth } from '@/contexts/authContext';
import useRouteGuard from '@/utils/useRouteGuard';

export default function DashboardPage() {
	const { loading, signed, logOut } = useAuth();

	const finished = useRouteGuard({
		loading,
		authenticated: signed,
		authenticationRoute: '/authentication'
	});

	return !finished ? (
		<LoadComponent />
	) : (
		<div onClick={logOut}>Dashboard</div>
	);
}
