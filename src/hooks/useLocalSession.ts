import { Network } from '@capacitor/network';
import { EEvent, Page, Status } from 'enums';
import { AppContext, useSession } from 'hooks';
import { isMobile, isNetworkAvail } from 'platform';
import { useContext, useEffect, useState } from 'react';

function useLocalSession(skipVerification = true) {
	const { logout, navigate } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession(skipVerification);
	const [isAppConnected, setIsAppConnected] = useState(true);

	useEffect(() => {
		const checkNetwork = !skipVerification && isMobile && isNetworkAvail;

		async function getNetworkStatus(): Promise<boolean> {
			return new Promise(resolve => {
				Network.getStatus().then(status => resolve(status?.connected === true));
			});
		}
		if (checkNetwork) {
			getNetworkStatus().then(status => setIsAppConnected(status));
			Network?.addListener(EEvent.NETWORK_CHANGE, status => {
				setIsAppConnected(status?.connected === true);
			});
		}

		return () => {
			checkNetwork && Network?.removeAllListeners();
		};
	}, [skipVerification]);

	useEffect(() => {
		if (!skipVerification && verifyingSession === Status.SUCCESS && !sessionVerified) {
			logout();
			navigate(Page.LOGIN);
		}
	}, [logout, navigate, skipVerification, sessionVerified, verifyingSession]);

	return { verifyingSession, sessionVerified, isAppConnected };
}

export default useLocalSession;
