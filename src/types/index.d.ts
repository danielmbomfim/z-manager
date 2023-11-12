import { NextApiRequest } from 'next';

export interface LoginRequest extends NextApiRequest {
	body: {
		googleId: string;
		googleToken: string;
	};
}
