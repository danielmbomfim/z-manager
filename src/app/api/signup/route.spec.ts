import { createMocks } from 'node-mocks-http';
import { POST as handler } from '@/app/api/signup/route';
import { LoginTicket } from 'google-auth-library';
import { prismaMock } from '@/services/mocks/prismaMock';
import { oauthMock } from '@/services/mocks/oauthMock';
import { NextApiRequest, NextApiResponse } from 'next';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface APiResponse extends NextApiResponse {
	__getJSONData: () => string;
}

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

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		await handler(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toMatchObject({
			token: expect.any(String),
			user
		});
	});

	it('should fail if the data is not passed', async () => {
		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST'
		});

		await handler(req, res);

		expect(res.statusCode).toBe(422);
		expect(res._getJSONData()).toEqual({
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

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		await handler(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toEqual({
			error: 'account already exist'
		});
	});

	it('should fail if a unexpected error occurs', async () => {
		prismaMock.user.create.mockRejectedValue(new Error('unexpected error'));

		oauthMock.getToken.mockResolvedValue(tokenResponse);
		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		await handler(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toBeNull();
	});

	it('should fail if the google token is rejected', async () => {
		prismaMock.user.create.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.getToken.mockRejectedValue(new Error());

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: {
				googleAccessToken: 'access_token'
			}
		});

		await handler(req, res);

		expect(res.statusCode).toBe(301);
		expect(res._getJSONData()).toEqual({ error: 'invalid token' });
	});
});
