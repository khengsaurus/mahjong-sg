import { Keyboard } from '@capacitor/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { EEvent } from 'enums';
import { isAndroid, isKeyboardAvail } from 'platform';
import { useLayoutEffect, useState } from 'react';

/**
 * Android: Capacitor.Keyboard is not firing when android:windowSoftInputMode="adjustNothing".
 * As such, since we are using android:windowSoftInputMode="adjustPan". On keyboard show, if
 * the position:absolute bottom buttons are shown, they will overlap with components above.
 * Workaround: do not show if keyboard shows
 */
const useAndroidKeyboardListener = (landscapeOnly = false) => {
	const [showBottom, setShowBottom] = useState(true);
	const isLandscape = [
		ScreenOrientation.ORIENTATIONS.LANDSCAPE,
		ScreenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY,
		ScreenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY
	].includes(ScreenOrientation.type);

	useLayoutEffect(() => {
		if (isKeyboardAvail && isAndroid && (landscapeOnly ? isLandscape : true)) {
			Keyboard.addListener(EEvent.KEYBOARDWILLSHOW, () => {
				setShowBottom(false);
			});
			Keyboard.addListener(EEvent.KEYBOARDWILLHIDE, () => {
				setShowBottom(true);
			});
		}
		return () => {
			if (isKeyboardAvail && isAndroid) {
				Keyboard.removeAllListeners();
			}
		};
	}, [isLandscape, landscapeOnly]);

	return { showBottom };
};

export default useAndroidKeyboardListener;
