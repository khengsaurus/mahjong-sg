import { useContext, useEffect } from 'react';
import FBService from 'shared/service/MyFirebaseService';
import { AppContext } from './AppContext';
import { useAsync } from './useHooks';

function useSession() {
	const { user, handleUserState } = useContext(AppContext);
	const { execute, status: verifyingSession, value: sessionValid } = useAsync(handleSession, false);
	async function handleSession(): Promise<boolean> {
		return new Promise(resolve => {
			try {
				if (user && FBService.userAuthenticated()) {
					resolve(true);
				} else {
					handleUserState().then(res => {
						resolve(res);
					});
				}
			} catch (err) {
				console.error(err);
				resolve(false);
			}
		});
	}

	useEffect(() => {
		execute();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return { verifyingSession, sessionValid };
}

export default useSession;
