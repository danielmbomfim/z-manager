/** @type {import('ts-jest').JestConfigWithTsJest} */
// Jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
	dir: './'
});

module.exports = createJestConfig({
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
});
