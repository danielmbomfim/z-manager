'use client';
import {
	CodeResponse,
	CredentialResponse,
	GoogleLogin,
	useGoogleLogin
} from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/authContext';
import getErrorMessage from '@/utils/getErrorMessage';
import {
	AuthenticationArea,
	Logo,
	AuthenticationButton,
	AuthenticationText
} from './styles';

export default function AuthPage(): React.ReactElement {
	const auth = useAuth();
	const googleLogin = useGoogleLogin({
		onSuccess: handleRegister,
		flow: 'auth-code'
	});

	function handleLogin(data: CredentialResponse) {
		toast.promise(auth.login(data), {
			success: 'Login efetuado com sucesso',
			error: { render: getErrorMessage },
			pending: 'Validando informações'
		});
	}

	function handleRegister(data: CodeResponse) {
		toast.promise(auth.register(data), {
			success: 'Login efetuado com sucesso',
			error: { render: getErrorMessage },
			pending: 'Validando informações'
		});
	}

	return (
		<AuthenticationArea>
			<Logo src="logo.png" />
			<AuthenticationText>
				Entre com sua conta para poder acompanhar os seus projetos
			</AuthenticationText>
			<GoogleLogin width={350} onSuccess={handleLogin} />
			<AuthenticationText>
				Ainda não possui uma conta? Crie uma de forma gratuita
			</AuthenticationText>
			<AuthenticationButton onClick={() => googleLogin()}>
				Registrar conta
			</AuthenticationButton>
		</AuthenticationArea>
	);
}
