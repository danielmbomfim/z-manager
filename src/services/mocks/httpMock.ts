import { RequestOptions, createMocks } from 'node-mocks-http';

export function createRequestMock(options: RequestOptions) {
	const { req } = createMocks<Request>(options);

	req.json = () => new Promise((resolve) => resolve(req.body));

	return req;
}
