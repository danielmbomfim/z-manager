import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import {
	LoginTicket,
	OAuth2Client,
	VerifyIdTokenOptions
} from 'google-auth-library';
import {
	GetTokenOptions,
	GetTokenResponse
} from 'google-auth-library/build/src/auth/oauth2client';

import oauth from '../oauth';

interface MockOAuth2Client extends OAuth2Client {
	verifyIdToken: (options: VerifyIdTokenOptions) => Promise<LoginTicket>;
	getToken: (code: string | GetTokenOptions) => Promise<GetTokenResponse>;
}

jest.mock('../oauth', () => ({
	__esModule: true,
	default: mockDeep<MockOAuth2Client>()
}));

beforeEach(() => {
	mockReset(oauthMock);
});

export const oauthMock = oauth as unknown as DeepMockProxy<MockOAuth2Client>;
