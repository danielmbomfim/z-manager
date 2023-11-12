import { createMocks, createRequest, createResponse } from 'node-mocks-http';
import { POST as handler } from '@/app/api/login/route';
import { LoginTicket } from 'google-auth-library';
import { prismaMock } from '@/services/mocks/prismaMock';
import { oauthMock } from '@/services/mocks/oauthMock';
import { NextApiRequest, NextApiResponse } from 'next';

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

describe('POST /login', () => {
	it('should return the login data', async () => {
		prismaMock.user.findUnique.mockResolvedValue({
			...user,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		oauthMock.verifyIdToken.mockResolvedValue(loginTicket);

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: { googleToken: 'token', googleId: '1' }
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
			error: [
				'googleId is a required field',
				'googleToken is a required field'
			]
		});
	});

	it('should fail if the user does not exist', async () => {
		prismaMock.user.findUnique.mockResolvedValue(null);

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: {
				googleToken: 'token',
				googleId: '1'
			}
		});

		await handler(req, res);

		expect(res.statusCode).toBe(301);
		expect(res._getJSONData()).toEqual({
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

		const { req, res } = createMocks<NextApiRequest, APiResponse>({
			method: 'POST',
			body: { googleToken: 'token', googleId: '1' }
		});

		await handler(req, res);

		expect(res.statusCode).toBe(301);
		expect(res._getJSONData()).toEqual({
			error: 'invalid token'
		});
	});
});
