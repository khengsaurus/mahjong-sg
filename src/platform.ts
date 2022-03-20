import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AppFlag, Platform } from 'enums';

export const isDev = process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV);

export const isDevBot = process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV_BOT);

export const isIOS = Capacitor.getPlatform() === Platform.IOS;

export const isAndroid = Capacitor.getPlatform() === Platform.ANDROID;

export const isKeyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;

export const isNetworkAvail = Capacitor.isPluginAvailable('Network');

export const platform =
	process.env.REACT_APP_PLATFORM === Platform.MOBILE ? 'app' : 'website';

export const isMobile = process.env.REACT_APP_PLATFORM === Platform.MOBILE;

export async function triggerHaptic(impact = ImpactStyle.Light) {
	if (isMobile) {
		try {
			await Haptics.impact({ style: impact });
		} catch (err) {
			console.info('Platform does not support Haptics');
		}
	}
}
