import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { history } from 'App';
import { useContext, useEffect, useState } from 'react';
import { EEvent, Page, Platform, Status } from 'shared/enums';
import { AppContext, useSession } from 'shared/hooks';

function useLocalSession(skipVerification = true) {
	const { logout } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession(skipVerification);
	const [isAppConnected, setIsAppConnected] = useState(true);

	useEffect(() => {
		const checkNetwork =
			!skipVerification &&
			process.env.REACT_APP_PLATFORM === Platform.MOBILE &&
			Capacitor.isPluginAvailable('Network');

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
			if (checkNetwork) {
				Network?.removeAllListeners();
			}
		};
	}, [skipVerification]);

	useEffect(() => {
		if (!skipVerification) {
			if (verifyingSession === Status.SUCCESS && !sessionVerified) {
				logout();
				history.push(Page.LOGIN);
			}
		}
	}, [skipVerification, verifyingSession, sessionVerified, logout]);

	return { verifyingSession, sessionVerified, isAppConnected };
}

export default useLocalSession;
