import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import prisma from '@/services/prisma';
import client from '@/services/oauth';
import { LoginRequest } from '@/types';
import { NextApiResponse } from 'next';

const loginSchema = yup.object().shape({
	googleId: yup.string().required(),
	googleToken: yup.string().required()
});

export async function POST(req: LoginRequest, res: NextApiResponse) {
	try {
		await loginSchema.validate(req.body, { abortEarly: false });
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return res.status(422).json({ error: error.errors });
		}
	}

	const { googleId, googleToken } = req.body;

	const user = await prisma.user.findUnique({
		where: { googleId },
		select: { id: true, name: true, email: true, imageUrl: true }
	});

	if (!user) {
		return res.status(301).json({ error: 'user not found' });
	}

	const isValid = await verifyGoogleToken(googleToken, googleId);

	if (!isValid) {
		return res.status(301).json({ error: 'invalid token' });
	}

	const token = jwt.sign({ id: user!.id }, process.env.SECRET as string, {
		expiresIn: '1h'
	});

	return res.json({ token, user });
}

async function verifyGoogleToken(
	token: string,
	googleId: string
): Promise<boolean> {
	try {
		const ticket = await client.verifyIdToken({
			idToken: token
		});

		const payload = ticket.getPayload();
		const userId = payload!.sub;

		return userId == googleId;
	} catch (error) {
		return false;
	}
}
