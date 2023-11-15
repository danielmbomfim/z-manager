import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const spin = keyframes`
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
`;

export const Container = styled.main`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 15px;

	font-size: 2rem;
`;

export const Text = styled.span`
	color: #ffffff;
	font-size: 2rem;
`;

export const Icon = styled(FontAwesomeIcon)`
	height: 1em;
	font-size: 2rem;
	color: #ffffff;
	animation: ${spin} 2s infinite linear;
`;
