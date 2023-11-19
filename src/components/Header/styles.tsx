import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #1f2933;
	height: 74px;
	width: 100%;
`;

export const Logo = styled.img`
	height: 60px;
	width: 100%;
	object-fit: contain;
	margin: 4px;
	border-radius: 10px;
`;

export const RightArea = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
`;

export const UserImage = styled.img.attrs({
	role: 'button'
})`
	height: 40px;
	width: 40px;
	object-fit: contain;
	align-self: center;
	margin-right: 10px;
	margin-left: 3px;
	border: 3px solid transparent;
	border-radius: 50%;
	cursor: pointer;

	&:hover {
		border: 3px solid gray;
	}
`;

export const UserOptionsContainer = styled.div<{ $visible: boolean }>`
	position: absolute;
	background-color: #fff;
	max-width: 400px;
	top: 115%;
	right: 10px;
	border-radius: 3px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
	display: ${(props) => (props.$visible ? 'block' : 'none')};
`;

export const UserOption = styled.button`
	background-color: ${(props) => props.theme.primary.contrastText};
	color: ${(props) => props.theme.primary.main};
	border: none;
	padding: 10px;
	width: 100%;
	min-width: 100px;
	text-align: right;
	white-space: nowrap;
	border-radius: 3px;
	gap: 5px;
	cursor: pointer;

	&:hover {
		background-color: #dadce0;
	}
`;
