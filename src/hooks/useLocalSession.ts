import { Page, Status } from 'enums';
import { AppContext, useSession } from 'hooks';
import { useContext, useEffect } from 'react';

function useLocalSession(skipVerification = true) {
	const { logout, navigate } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession(skipVerification);

	useEffect(() => {
		if (!skipVerification && verifyingSession === Status.SUCCESS && !sessionVerified) {
			logout();
			navigate(Page.LOGIN);
		}
	}, [logout, navigate, skipVerification, sessionVerified, verifyingSession]);

	return { verifyingSession, sessionVerified };
}

export default useLocalSession;
