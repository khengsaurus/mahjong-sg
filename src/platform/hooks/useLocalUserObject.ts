import jwt from 'jsonwebtoken';
import useLocalStorage from 'platform/hooks/useLocalStorage';
import { useCallback } from 'react';
import { User } from 'shared/models';
import { objToUser, userToObj } from 'shared/util';

export interface IUseLocalUserObject {
	resolveLocalUO: () => Promise<User>;
	handleLocalUO: (user: any) => void;
}

function useLocalUserObject(): IUseLocalUserObject {
	const [localUO, setLocalUO] = useLocalStorage<string>('jwt', null);
	const secretKey = 'shouldBeServerSideKey';

	const resolveLocalUO = useCallback(() => {
		return new Promise<User>((resolve, reject) => {
			try {
				resolve(localUO ? objToUser(jwt.verify(localUO, secretKey) as IJwtData) : null);
			} catch (err) {
				reject(new Error('User token not found: ' + err.msg));
			}
		});
	}, [localUO]);

	const handleLocalUO = useCallback(
		(user?: User) => {
			if (user) {
				const token = jwt.sign(userToObj(user), secretKey, {
					algorithm: 'HS256'
				});
				setLocalUO(token);
			} else {
				sessionStorage.clear();
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i];
					var eqPos = cookie.indexOf('=');
					var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
					document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
				}
				setLocalUO(null);
			}
		},
		[setLocalUO]
	);

	return { resolveLocalUO, handleLocalUO };
}

export default useLocalUserObject;
