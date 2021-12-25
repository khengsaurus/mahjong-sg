import { history } from 'App';
import { useContext, useEffect } from 'react';
import { Page, Status } from 'shared/enums';
import { AppContext, useSession } from 'shared/hooks';

// default skipVerification to true to call validation only when parent component specifies false
function useLocalSession(skipVerification = true) {
	const { logout } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession();

	useEffect(() => {
		if (!skipVerification) {
			if (verifyingSession === Status.SUCCESS && !sessionVerified) {
				logout();
				history.push(Page.LOGIN);
			}
		}
	}, [skipVerification, verifyingSession, sessionVerified, logout]);

	return { verifyingSession, sessionVerified };
}

export default useLocalSession;
