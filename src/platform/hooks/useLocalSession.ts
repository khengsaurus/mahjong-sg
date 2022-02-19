import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { useContext, useEffect, useState } from 'react';
import { EEvent, Page, Status } from 'shared/enums';
import { AppContext, useSession } from 'shared/hooks';
import { isMobile } from 'shared/util';

function useLocalSession(skipVerification = true) {
	const { logout, navigate } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession(skipVerification);
	const [isAppConnected, setIsAppConnected] = useState(true);

	useEffect(() => {
		const checkNetwork = !skipVerification && isMobile() && Capacitor.isPluginAvailable('Network');

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
