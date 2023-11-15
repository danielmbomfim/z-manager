'use client';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Container, Text, Icon } from './styles';

export default function LoadComponent() {
	return (
		<Container>
			<Icon icon={faSpinner} size="2x" color="#ffffff" spin />
			<Text>Carregando</Text>
		</Container>
	);
}
