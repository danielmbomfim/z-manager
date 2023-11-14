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
