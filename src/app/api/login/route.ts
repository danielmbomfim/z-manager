import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import prisma from '@/services/prisma';
import client from '@/services/oauth';
import { LoginRequest } from '@/types';

const loginSchema = yup.object().shape({
	googleId: yup.string().required(),
	googleToken: yup.string().required()
});

export async function POST(req: LoginRequest) {
	const body = await req.json();

	try {
		await loginSchema.validate(body, { abortEarly: false });
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return Response.json({ error: error.errors }, { status: 422 });
		}
	}

	const user = await prisma.user.findUnique({
		where: { googleId: body.googleId },
		select: { id: true, name: true, email: true, imageUrl: true }
	});

	if (!user) {
		return Response.json({ error: 'user not found' }, { status: 301 });
	}

	const isValid = await verifyGoogleToken(body.googleToken, body.googleId);

	if (!isValid) {
		return Response.json({ error: 'invalid token' }, { status: 301 });
	}

	const token = jwt.sign({ id: user!.id }, process.env.SECRET as string, {
		expiresIn: '1h'
	});

	return Response.json({ token, user });
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
