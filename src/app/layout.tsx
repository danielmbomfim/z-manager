import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import ContextProviders from '@/contexts';
import StyledComponentsRegistry from '@/lib/registry';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Gerenciador de projetos',
	description: 'Um gerenciador de projetos'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR">
			<body className={inter.className}>
				<StyledComponentsRegistry>
					<ContextProviders>
						<ToastContainer theme="dark" />
						{children}
					</ContextProviders>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
