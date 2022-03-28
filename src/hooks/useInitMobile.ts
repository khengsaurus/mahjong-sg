import { App } from '@capacitor/app';
import { TextZoom } from '@capacitor/text-zoom';
import { isDev, isIOS, isMobile } from 'platform';
import { useEffect, useState } from 'react';

interface IPlatformAppSettings {
	appVersion: number;
}

const useInitMobile = (): IPlatformAppSettings => {
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

	return { appVersion };
};

export default useInitMobile;
