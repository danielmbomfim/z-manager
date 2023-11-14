import { CodeResponse, CredentialResponse } from '@react-oauth/google';

export interface SignupRequest extends Request {
	json: () => Promise<{
		googleAccessToken: string;
	}>;
}

export interface LoginRequest extends Request {
	json: () => Promise<{
		googleId: string;
		googleToken: string;
	}>;
}

export interface GoogleProfileData {
	sub: string;
	email: string;
	name: string;
	picture: string;
}

export interface UserData {
	id: number;
	name: string;
	email: string;
	imageUrl: string;
	googleId: string;
}

export interface AuthenticationResponse {
	user: UserData;
	token: string;
}

export interface AuthContextData {
	signed: boolean;
	user: {} | null;
	login: (data: CredentialResponse) => Promise<void>;
	register: (data: CodeResponse) => Promise<void>;
}
