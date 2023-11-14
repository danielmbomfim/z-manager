import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import prisma from '@/services/prisma';
import oauth from '@/services/oauth';
import { SignupRequest } from '@/types';
import { TokenPayload } from 'google-auth-library';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const signupSchema = yup.object().shape({
	googleAccessToken: yup.string().required()
});

export async function POST(req: SignupRequest) {
	const body = await req.json();

	try {
		await signupSchema.validate(body, { abortEarly: false });
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return Response.json({ error: error.errors }, { status: 422 });
		}
	}

	const userData = await getGoogleToken(body.googleAccessToken);

	if (!userData) {
		return Response.json({ error: 'invalid token' }, { status: 301 });
	}

	try {
		const user = await prisma.user.create({
			data: {
				name: userData.name as string,
				email: userData.email as string,
				imageUrl: userData.picture as string,
				googleId: userData.sub
			},
			select: { id: true, name: true, email: true, imageUrl: true }
		});

		const token = jwt.sign({ id: user!.id }, process.env.SECRET as string, {
			expiresIn: '1h'
		});
		return Response.json({ token, user });
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code == 'P2002') {
				return Response.json(
					{
						error: 'account already exist'
					},
					{ status: 409 }
				);
			}
		}

		return Response.json(null, { status: 500 });
	}
}

async function getGoogleToken(code: string): Promise<TokenPayload | null> {
	try {
		const { tokens } = await oauth.getToken(code);

		const ticket = await oauth.verifyIdToken({
			idToken: tokens.id_token!
		});

		return ticket.getPayload() as TokenPayload;
	} catch (error) {
		return null;
	}
}
