'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import {
	Container,
	Logo,
	RightArea,
	UserImage,
	UserOptionsContainer,
	UserOption
} from './styles';

export default function Header() {
	const router = useRouter();
	const { signed, user, logOut } = useAuth();
	const userButtonRef = useRef<HTMLImageElement>(null);
	const userOptionsRef = useRef<HTMLDivElement>(null);
	const [showUserMenu, setShowUserMenu] = useState(false);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function handleClickOutside(event: MouseEvent) {
		if (!userOptionsRef.current || !userButtonRef.current) {
			return;
		}

		if (userButtonRef.current === event.target) {
			return;
		}

		if (!userOptionsRef.current.contains(event.target as Node)) {
			setShowUserMenu(false);
		}
	}

	function handleSignOut() {
		logOut();
		setShowUserMenu(false);
	}

	function moveToUserPage() {
		router.push(`/user/${user?.id}`);
	}

	return !signed ? null : (
		<Container>
			<Link href="/dashboard">
				<Logo src="/logo.png" title="Página inicial" />
			</Link>
			<RightArea>
				<UserImage
					ref={userButtonRef}
					src={user?.imageUrl}
					title={`${user?.name}\n${user?.email}`}
					onClick={() => setShowUserMenu(!showUserMenu)}
				/>
				<UserOptionsContainer
					$visible={showUserMenu}
					ref={userOptionsRef}
				>
					<UserOption onClick={moveToUserPage}>
						Configurações
					</UserOption>
					<UserOption onClick={handleSignOut}>Sair</UserOption>
				</UserOptionsContainer>
			</RightArea>
		</Container>
	);
}
