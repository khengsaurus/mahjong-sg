import { useCallback, useEffect, useState } from 'react';
import { Status } from 'shared/enums';

export const useAsync = <T, E = string>(asyncFunction: () => Promise<T>, immediate = true) => {
	const [status, setStatus] = useState<Status>(Status.IDLE);
	const [value, setValue] = useState<T | null>(null);
	const [error, setError] = useState<E | null>(null);
	const execute = useCallback(() => {
		setStatus(Status.PENDING);
		setValue(null);
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
	}, [asyncFunction]);

	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [execute, immediate]);

	return { execute, status, value, error };
};

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});
	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};
	return [storedValue, setValue] as const;
}
