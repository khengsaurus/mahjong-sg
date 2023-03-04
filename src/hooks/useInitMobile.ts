import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { getRandomFoodEmoji } from 'utility';

interface IPlatformAppSettings {
	homeAlert: string;
}

const useInitMobile = (): IPlatformAppSettings => {
	const { notifsContent } = useSelector((state: IStore) => state);
	const [homeAlert, setHomeAlert] = useState('');

	// Display notification if app version < latest version, or notifs is not empty
	useEffect(() => {
		if (!isEmpty(notifsContent)) {
			const notifs = notifsContent?.notifs || [];
			if (notifs.length > 0) {
				setHomeAlert(notifs[notifs.length - 1].message + getRandomFoodEmoji());
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(notifsContent)]);

	return { homeAlert };
};

export default useInitMobile;
