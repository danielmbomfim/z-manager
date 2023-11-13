import { NextApiRequest } from 'next';

export interface SignupRequest extends NextApiRequest {
	body: {
		googleAccessToken: string;
	};
}

export interface LoginRequest extends NextApiRequest {
	body: {
		googleId: string;
		googleToken: string;
	};
}
