'use client';
import {
	ThemeProvider,
	createGlobalStyle,
	DefaultTheme
} from 'styled-components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/contexts/authContext';

const appTheme: DefaultTheme = {
	primary: {
		main: '#344955',
		contrastText: '#fff'
	},
	secondary: {
		main: '#f9aa33',
		contrastText: '#485b66'
	},
	background: '#3B5361'
};

const GlobalStyle = createGlobalStyle`
	body {
		background-color: ${(props) => props.theme.background};
		font-family: arial;
	}
`;

export default function ContextProviders({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider theme={appTheme}>
			<GoogleOAuthProvider
				clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID as string}
			>
				<AuthProvider>
					<GlobalStyle />
					{children}
				</AuthProvider>
			</GoogleOAuthProvider>
		</ThemeProvider>
	);
}
