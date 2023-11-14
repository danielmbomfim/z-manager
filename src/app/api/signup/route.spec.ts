import { POST as handler } from '@/app/api/signup/route';
import { LoginTicket } from 'google-auth-library';
import { prismaMock } from '@/services/mocks/prismaMock';
import { oauthMock } from '@/services/mocks/oauthMock';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignupRequest } from '@/types';
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

const tokenResponse: GetTokenResponse = {
	tokens: { id_token: null },
	res: null
};

describe('POST /signup', () => {
	it('should return a user data', async () => {
		prismaMock.user.create.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.getToken.mockResolvedValue(tokenResponse);
		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const req: SignupRequest = createRequestMock({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		const res = await handler(req);

		expect(res.status).toBe(200);
		expect(await res.json()).toMatchObject({
			token: expect.any(String),
			user
		});
	});

	it('should fail if the data is not passed', async () => {
		const req: SignupRequest = createRequestMock({
			method: 'POST'
		});

		const res = await handler(req);

		expect(res.status).toBe(422);
		expect(await res.json()).toEqual({
			error: ['googleAccessToken is a required field']
		});
	});

	it('should fail if the user already exists', async () => {
		prismaMock.user.create.mockRejectedValue(
			new PrismaClientKnownRequestError('', {
				code: 'P2002',
				clientVersion: 'mock'
			})
		);

		oauthMock.getToken.mockResolvedValue(tokenResponse);
		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const req: SignupRequest = createRequestMock({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		const res = await handler(req);

		expect(res.status).toBe(409);
		expect(await res.json()).toEqual({
			error: 'account already exist'
		});
	});

	it('should fail if a unexpected error occurs', async () => {
		prismaMock.user.create.mockRejectedValue(new Error('unexpected error'));

		oauthMock.getToken.mockResolvedValue(tokenResponse);
		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const req: SignupRequest = createRequestMock({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		const res = await handler(req);

		expect(res.status).toBe(500);
		expect(await res.json()).toBeNull();
	});

	it('should fail if the google token is rejected', async () => {
		prismaMock.user.create.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.getToken.mockRejectedValue(new Error());

		const req: SignupRequest = createRequestMock({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		const res = await handler(req);

		expect(res.status).toBe(301);
		expect(await res.json()).toEqual({ error: 'invalid token' });
	});
});
