import styled from 'styled-components';

export const AuthenticationArea = styled.main`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 450px;
	width: 350px;
	margin: auto;
	margin-top: 50px;
	padding: 10px 30px;
	background-color: ${(props) => props.theme.primary.main};
	border-radius: 15px;
`;

export const Logo = styled.img`
	width: 100px;
	height: 100px;
	border: 2px solid #fff;
	border-radius: 25px;
	margin: 0 auto;
	margin-bottom: 30px;
`;

export const AuthenticationText = styled.p`
	color: ${(props) => props.theme.primary.contrastText};
`;

export const AuthenticationButton = styled.button`
	border: none;
	background-color: ${(props) => props.theme.secondary.main};
	color: ${(props) => props.theme.secondary.contrastText};
	font-weight: 500;
	font-size: 14pt;
	padding: 8px;
	border-radius: 5px;
	cursor: pointer;
`;
