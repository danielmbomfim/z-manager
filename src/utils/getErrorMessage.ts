import { isAxiosError } from 'axios';
import { ToastContentProps } from 'react-toastify';

export default function getErrorMessage({ data }: ToastContentProps<Error>) {
	let message;

	if (isAxiosError(data)) {
		message = data?.response?.data.error;
	}

	return message ? message : 'Houve uma falha inexperada';
}
