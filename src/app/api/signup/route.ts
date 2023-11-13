import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import prisma from '@/services/prisma';
import oauth from '@/services/oauth';
import { SignupRequest } from '@/types';
import { TokenPayload } from 'google-auth-library';
import { NextApiResponse } from 'next';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const signupSchema = yup.object().shape({
	googleAccessToken: yup.string().required()
});

export async function POST(req: SignupRequest, res: NextApiResponse) {
	try {
		await signupSchema.validate(req.body, { abortEarly: false });
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return res.status(422).json({ error: error.errors });
		}
	}

	const { googleAccessToken } = req.body;

	const userData = await getGoogleToken(googleAccessToken);

	if (!userData) {
		return res.status(301).json({ error: 'invalid token' });
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
		return res.json({ token, user });
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code == 'P2002') {
				return res.status(409).json({
					error: 'account already exist'
				});
			}
		}

		return res.status(500).json(null);
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
