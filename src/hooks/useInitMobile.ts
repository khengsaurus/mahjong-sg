import { App } from '@capacitor/app';
import { TextZoom } from '@capacitor/text-zoom';
import { useAndroidBack } from 'hooks';
import isEmpty from 'lodash/isEmpty';
import { Notif } from 'messages';
import { isAndroid, isDev, isIOS, isMobile } from 'platform';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { getRandomFoodEmoji } from 'utility';

interface IPlatformAppSettings {
	appVersion: number;
	homeAlert: string;
}

const useInitMobile = (handleHome: () => void): IPlatformAppSettings => {
	const { notifsContent } = useSelector((state: IStore) => state);
	const [homeAlert, setHomeAlert] = useState('');
	const [appVersion, setAppVersion] = useState(
		isMobile
			? isIOS
				? Number(process.env.REACT_APP_IOS_VERSION || 1)
				: Number(process.env.REACT_APP_AND_VERSION || 1)
			: 1
	);

	async function ensureDefaultFontSize() {
		try {
			const zoom = (await TextZoom?.get()).value;
			if (zoom !== 1) {
				TextZoom.set({ value: 1 });
			}
		} catch (err) {
			isDev && console.info(err);
		}
	}

	async function getAppVersion() {
		try {
			App.getInfo().then(info => setAppVersion(Number(info.version)));
		} catch (err) {
			isDev && console.info(err);
		}
	}

	useEffect(() => {
		if (isMobile) {
			getAppVersion();
			ensureDefaultFontSize();
		}
	}, []);

	useEffect(() => {
		if (isMobile && !isEmpty(notifsContent)) {
			const showUpdateAlert =
				(isIOS && appVersion < notifsContent.latestIOSVersion) ||
				(isAndroid && appVersion < notifsContent.latestAndVersion);
			const notifs = notifsContent?.notifs || [];
			if (showUpdateAlert) {
				setHomeAlert(Notif.UPDATE + getRandomFoodEmoji());
			} else if (notifs.length > 0) {
				setHomeAlert(notifs[notifs.length - 1].message + getRandomFoodEmoji());
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appVersion, JSON.stringify(notifsContent)]);

	useAndroidBack(handleHome);

	return { homeAlert, appVersion };
};

export default useInitMobile;
