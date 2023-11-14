import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		primary: { main: string; contrastText: string };
		secondary: { main: string; contrastText: string };
		background: string;
	}
}
