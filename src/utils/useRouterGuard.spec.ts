import { redirect } from 'next/navigation';
import useRouteGuard from './useRouteGuard';

jest.mock('next/navigation', () => ({
	redirect: jest.fn()
}));

describe.only('Routes Guard', () => {
	it('should not redirect if loading param is set to true', () => {
		const finished = useRouteGuard({
			authenticated: false,
			loading: true,
			authenticationRoute: '/teste'
		});

		expect(redirect).toHaveBeenCalledTimes(0);
		expect(finished).toBeFalsy();
	});

	it('should redirect to authentication page', () => {
		const finished = useRouteGuard({
			authenticated: false,
			loading: false,
			authenticationRoute: '/authentication-test'
		});

		expect(redirect).toHaveBeenCalledWith('/authentication-test');
		expect(finished).toBeTruthy();
	});

	it('should redirect to home page', () => {
		const finished = useRouteGuard({
			authenticated: true,
			loading: false,
			homepageRoute: '/homepage-test'
		});

		expect(redirect).toHaveBeenCalledWith('/homepage-test');
		expect(finished).toBeTruthy();
	});
});
