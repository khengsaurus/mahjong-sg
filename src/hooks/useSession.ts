import ServiceInstance from 'service/ServiceLayer';
import { useCallback, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAsync } from 'hooks';
import { IStore } from 'store';
import { AppContext } from './AppContext';

function useSession(skipVerification = true) {
	const { user } = useSelector((state: IStore) => state);
	const { handleUserState } = useContext(AppContext);

	const validateSession = useCallback(
		(timeout = 600): Promise<boolean> => {
			return new Promise(async resolve => {
				if (!!user && (await ServiceInstance.FBAuthenticated())) {
					resolve(true);
				} else {
					setTimeout(async () => {
						try {
							const FBAuthenticated = await ServiceInstance.FBAuthenticated();
							if (FBAuthenticated) {
								resolve(!!user || (await handleUserState()));
							} else {
								resolve(false);
							}
						} catch (err) {
							console.error(err);
							resolve(false);
						}
					}, timeout);
				}
			});
		},
		[user, handleUserState]
	);

	const { execute, status: verifyingSession, value: sessionVerified } = useAsync(validateSession, false, true);

	useEffect(() => {
		!skipVerification && execute();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { verifyingSession, sessionVerified: sessionVerified || skipVerification };
}

export default useSession;
