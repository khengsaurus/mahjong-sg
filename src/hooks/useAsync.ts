import { Status } from 'enums';
import { useCallback, useEffect, useState } from 'react';

function useAsync<T, E = string>(asyncFunction: () => Promise<T>, immediate = true, defaultValue?: T) {
	const [status, setStatus] = useState<Status>(Status.IDLE);
	const [value, setValue] = useState<T | null>(defaultValue);
	const [error, setError] = useState<E | null>(null);

	const execute = useCallback(async (): Promise<void> => {
		setStatus(Status.PENDING);
		setValue(defaultValue || null);
		setError(null);
		return asyncFunction()
			.then((response: any) => {
				setStatus(Status.SUCCESS);
				setValue(response);
			})
			.catch((error: any) => {
				setStatus(Status.ERROR);
				setError(error);
			});
	}, [defaultValue, asyncFunction]);

	useEffect(() => {
		immediate && execute();
	}, [execute, immediate]);

	return { execute, status, value, error };
}

export default useAsync;
