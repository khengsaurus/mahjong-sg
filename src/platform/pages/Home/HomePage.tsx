import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import {
	AboutButton,
	BackButton,
	DecorButton,
	HelpButton,
	HomeButton,
	PrivacyButton
} from 'platform/components/Buttons';
import { Loader, NetworkLoader } from 'platform/components/Loader';
import Overlay from 'platform/components/Overlay';
import { useAndroidBack, useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { BottomSpec, Centered, Main, NetworkAlert } from 'platform/style/StyledComponents';
import { StyledCenterText, StyledText } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { EEvent, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { HomeScreenText, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';

interface IHomePageP {
	markup: () => React.FC | JSX.Element;
	title?: string | JSX.Element;
	ready?: boolean;
	timeout?: number;
	misc?: 1 | 2 | 3;
	customBack?: () => void;
	fallbackTitle?: string;
	skipVerification?: boolean;
	offsetKeyboard?: number;
	landscapeOnly?: boolean;
}

export function renderDefaultTitle(title: string) {
	// ref-home-title shd be 40px
	return <StyledCenterText text={title} variant="h6" style={{ height: '30px', padding: '0px 10px 10px' }} />;
}

const HomePage = ({
	markup,
	title,
	ready = true,
	timeout = 1500,
	misc = 1,
	customBack = null,
	fallbackTitle = HomeScreenText.SOMETHING_WENT_WRONG,
	skipVerification = false,
	offsetKeyboard = 0
}: IHomePageP) => {
	const { handleHome, setAnnHuOpen } = useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const { verifyingSession, isAppConnected } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	/* ----------------------------------- Screen orientation ----------------------------------- */

	useLayoutEffect(() => {
		setAnnHuOpen(false);

		if (isMobile()) {
			// && Capacitor.getPlatform() === Platform.ANDROID
			ScreenOrientation?.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT).catch(_ => {
				console.info('Platform does not support @ionic-native/screen-orientation.ScreenOrientation.lock');
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ----------------- Keyboard offset for iOS + Android back button handling ----------------- */

	const [marginBottom, setMarginBottom] = useState<number | string>(0);
	const keyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;
	const platform = Capacitor.getPlatform();

	useEffect(() => {
		if (keyboardAvail && platform === Platform.IOS) {
			Keyboard.addListener(EEvent.KEYBOARDSHOW, info => {
				const keyboardHeight = Number(info?.keyboardHeight) || 0;
				const windowHeight = window?.screen?.height || 0;
				if (Number(keyboardHeight) && Number(windowHeight)) {
					const ratio = keyboardHeight > 0.4 * windowHeight ? 0.7 : 0.4;
					setMarginBottom(keyboardHeight * ratio - offsetKeyboard);
				}
			});
			Keyboard.addListener(EEvent.KEYBOARDHIDE, () => {
				setMarginBottom(0);
			});
		} else if (platform === Platform.ANDROID) {
			setMarginBottom('10%');
		}

		return () => {
			keyboardAvail && platform === Platform.IOS && Keyboard.removeAllListeners();
		};
	}, [platform, keyboardAvail, offsetKeyboard]);

	useAndroidBack(() => handleHome());

	/* --------------- End keyboard offset for iOS + Android back button handling --------------- */

	useEffect(() => {
		if (!ready) {
			timeoutRef.current = setTimeout(() => {
				setPendingScreen(
					<Centered>
						<StyledText text={fallbackTitle} variant="subtitle1" />
						<HomeButton />
						<Overlay />
					</Centered>
				);
			}, timeout);
		}

		return () => clearTimeout(timeoutRef.current);
	}, [ready, fallbackTitle, timeout]);

	function renderNetworkLoader() {
		return (
			<Fade in={!skipVerification && !isAppConnected} unmountOnExit>
				<NetworkAlert>
					<NetworkLoader />
					<StyledText text={ScreenTextEng.WAITING_NETWORK} variant="subtitle2" padding="0px 0px 0px 10px" />
				</NetworkAlert>
			</Fade>
		);
	}

	return (
		<HomeTheme>
			<Main>
				{renderNetworkLoader()}
				{(skipVerification || (!isEmpty(user) && verifyingSession !== Status.PENDING)) && ready ? (
					<>
						{!!title && (typeof title === 'string' ? renderDefaultTitle(title) : title)}
						<Centered style={{ marginBottom }}>{markup()}</Centered>
						<Overlay />
					</>
				) : (
					pendingScreen
				)}
				{misc !== 3 && (
					<BottomSpec>
						{misc === 1 ? (
							<>
								<DecorButton Button={PrivacyButton} showOnHover={['', 'dh', '']} />
								<DecorButton Button={AboutButton} showOnHover={['', 'db', '']} />
								<DecorButton Button={HelpButton} showOnHover={['', 'df', '']} />
							</>
						) : (
							<BackButton style={{ fontSize: 12, padding: 0 }} callback={customBack} />
						)}
					</BottomSpec>
				)}
			</Main>
		</HomeTheme>
	);
};

export default HomePage;
