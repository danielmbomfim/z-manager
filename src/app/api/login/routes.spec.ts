import { POST as handler } from '@/app/api/login/route';
import { LoginTicket } from 'google-auth-library';
import { prismaMock } from '@/services/mocks/prismaMock';
import { oauthMock } from '@/services/mocks/oauthMock';
import { LoginRequest } from '@/types';
import { createRequestMock } from '@/services/mocks/httpMock';

const user = {
	id: 1,
	name: 'name',
	email: 'email@email.com',
	imageUrl: 'https://image.com',
	googleId: '1'
};

const loginTicket = {
	getPayload: () => ({
		sub: user.googleId,
		name: user.name,
		email: user.email,
		picture: user.imageUrl
	})
} as LoginTicket;

describe('POST /login', () => {
	it('should return the login data', async () => {
		prismaMock.user.findUnique.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const req: LoginRequest = createRequestMock({
			method: 'POST',
			body: { googleToken: 'token', googleId: '1' }
		});

		const res = await handler(req);

		expect(res.status).toBe(200);
		expect(await res.json()).toMatchObject({
			token: expect.any(String),
			user
		});
	});

	it('should fail if the data is not passed', async () => {
		const req: LoginRequest = createRequestMock({
			method: 'POST'
		});

		const res = await handler(req);

		expect(res.status).toBe(422);
		expect(await res.json()).toEqual({
			error: [
				'googleId is a required field',
				'googleToken is a required field'
			]
		});
	});

	it('should fail if the user does not exist', async () => {
		prismaMock.user.findUnique.mockResolvedValue(null);

		const req: LoginRequest = createRequestMock({
			method: 'POST',
			body: {
				googleToken: 'token',
				googleId: '1'
			}
		});

		const res = await handler(req);

		expect(res.status).toBe(301);
		expect(await res.json()).toEqual({
			error: 'user not found'
		});
	});

	it('should fail if the google token is rejected', async () => {
		prismaMock.user.findUnique.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.verifyIdToken.mockRejectedValue(new Error());

		const req: LoginRequest = createRequestMock({
			method: 'POST',
			body: { googleToken: 'token', googleId: '1' }
		});

		const res = await handler(req);

		expect(res.status).toBe(301);
		expect(await res.json()).toEqual({
			error: 'invalid token'
		});
	});
});
