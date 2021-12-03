import useLocalStorage from 'platform/hooks/useLocalStorage';
import { useCallback } from 'react';

export interface IUseLocalObject<T> {
	resolveLocalObj: () => Promise<T>;
	handleLocalObj: (obj: T) => void;
}

function useLocalObj<T>(
	storageKey: string,
	parser: (obj: any, key?: string) => T,
	signingFn: (obj: T, key?: string) => string
): IUseLocalObject<T> {
	const [localObj, setLocalObj] = useLocalStorage<string>(storageKey, null);
	const key = 'shouldBeServerSideKey';

	const resolveLocalObj = useCallback(() => {
		return new Promise<T>((resolve, reject) => {
			try {
				resolve(localObj ? parser(localObj, key) : null);
			} catch (err) {
				reject(new Error(`Token not found for key '${storageKey}': ` + err.msg));
			}
		});
	}, [localObj, parser, storageKey]);

	const handleLocalObj = useCallback(
		(obj?: T) => {
			if (obj) {
				const token = signingFn(obj, key);
				setLocalObj(token);
			} else {
				sessionStorage.clear();
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i];
					var eqPos = cookie.indexOf('=');
					var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
					document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
				}
				setLocalObj(null);
			}
		},
		[setLocalObj, signingFn]
	);

	return { resolveLocalObj, handleLocalObj };
}

export default useLocalObj;
