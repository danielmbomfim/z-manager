'use client';
import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useEffect
} from 'react';
import { CodeResponse, CredentialResponse } from '@react-oauth/google';
import jwt from 'jsonwebtoken';
import api from '@/services/api';
import { GoogleProfileData, UserData } from '@/types';

interface AuthContextData {
	signed: boolean;
	user: UserData | null;
	login: (data: CredentialResponse) => Promise<void>;
	register: (data: CodeResponse) => Promise<void>;
	logOut: () => void;
}

const authContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserData | null>(null);

	useEffect(() => {
		window.addEventListener('storage', checkToken);

		async function loadData() {
			const data = localStorage.getItem('@authenticationData');

			if (data) {
				await setUser(JSON.parse(data).user);
			}
		}

		loadData();
		return () => window.removeEventListener('storage', checkToken);
	}, []);

	async function login(data: CredentialResponse) {
		const userData = jwt.decode(data.credential!) as GoogleProfileData;

		const response = await api.post('/login', {
			googleId: userData.sub,
			googleToken: data.credential
		});

		setUser(response.data.user);

		localStorage.setItem(
			'@authenticationData',
			JSON.stringify(response.data)
		);
	}

	async function register(data: CodeResponse) {
		const response = await api.post('/signup', {
			googleAccessToken: data.code
		});

		setUser(response.data.user);

		localStorage.setItem(
			'@authenticationData',
			JSON.stringify(response.data)
		);
	}

	function logOut() {
		localStorage.removeItem('@authenticationData');
		setUser(null);
	}

	function checkToken(event: StorageEvent) {
		if (event.key === '@authenticationData' && !event.newValue) {
			setUser(null);
		}
	}

	return (
		<authContext.Provider
			value={{ signed: !!user, user, register, login, logOut }}
		>
			{children}
		</authContext.Provider>
	);
}

export const useAuth = () => useContext(authContext);
