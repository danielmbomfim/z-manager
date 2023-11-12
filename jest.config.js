/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
	setupFilesAfterEnv: [
		'<rootDir>/src/services/mocks/prismaMock.ts',
		'<rootDir>/src/services/mocks/oauthMock.ts'
	],
	moduleNameMapper: {
		'@/services/(.*)$': '<rootDir>/src/services/$1',
		'@/app/(.*)$': '<rootDir>/src/app/$1'
	}
};
