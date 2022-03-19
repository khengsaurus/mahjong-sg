import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Platform } from 'enums';

export const isIOS = Capacitor.getPlatform() === Platform.IOS;

export const isAndroid = Capacitor.getPlatform() === Platform.ANDROID;

export const isKeyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;

export const isNetworkAvail = Capacitor.isPluginAvailable('Network');

export const platform = process.env.REACT_APP_PLATFORM === Platform.MOBILE ? Platform.MOBILE : Platform.WEB;

export const isMobile = platform === Platform.MOBILE;

export async function triggerHaptic(impact = ImpactStyle.Light) {
	if (isMobile) {
		try {
			await Haptics.impact({ style: impact });
		} catch (err) {
			console.info('Platform does not support Haptics');
		}
	}
}
