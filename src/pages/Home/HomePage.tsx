import { Keyboard } from '@capacitor/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Fade } from '@mui/material';
import {
	AboutButton,
	BackButton,
	DecorButton,
	HelpButton,
	HomeButton,
	Loader,
	NetworkLoader,
	Overlay,
	PrivacyButton,
	SingleActionModal
} from 'components';
import { EEvent, Status } from 'enums';
import { AppContext, useLocalSession } from 'hooks';
import isEmpty from 'lodash.isempty';
import { isAndroid, isIOS, isKeyboardAvail, isMobile } from 'platform';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText, ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { HomeTheme } from 'style/MuiStyles';
import { BottomSpec, Centered, Main, NetworkAlert } from 'style/StyledComponents';
import { StyledCenterText, StyledText } from 'style/StyledMui';

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
	return (
		<StyledCenterText
			text={title}
			variant="h6"
			style={{ height: '30px', padding: '0px 10px 10px' }}
		/>
	);
}

const HomePage = ({
	markup,
	title,
	ready = true,
	timeout = 2500,
	misc = 1,
	customBack = null,
	fallbackTitle = HomeScreenText.SOMETHING_WENT_WRONG,
	skipVerification = false,
	offsetKeyboard = 0
}: IHomePageP) => {
	const { appConnected, homeAlert, setAnnHuOpen, showHomeAlert, setShowHomeAlert } =
		useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const { verifyingSession } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(
		<Loader />
	);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	/* ------------------------- Screen orientation ------------------------- */

	useLayoutEffect(() => {
		setAnnHuOpen(false);

		if (isMobile) {
			ScreenOrientation.lock(ScreenOrientation.ORIENTATIONS.PORTRAIT).catch(_ => {
				console.info(
					'Platform does not support @ionic-native/screen-orientation.ScreenOrientation.lock'
				);
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---------------------- Keyboard offset for iOS ---------------------- */

	const [marginBottom, setMarginBottom] = useState<number | string>(0);

	useEffect(() => {
		if (isKeyboardAvail && isIOS) {
			Keyboard.addListener(EEvent.KEYBOARDSHOW, info => {
				const keyboardHeight = Number(info?.keyboardHeight) || 0;
				const windowHeight = window?.screen?.height || 0;
				if (Number(keyboardHeight) && Number(windowHeight)) {
					const ratio = keyboardHeight > 0.4 * windowHeight ? 0.7 : 0.4;
					setMarginBottom(keyboardHeight * ratio - offsetKeyboard);
				}
			});
			Keyboard.addListener(EEvent.KEYBOARDHIDE, () => setMarginBottom(0));
		} else if (isAndroid) {
			setMarginBottom('10%');
		}

		return () => {
			isKeyboardAvail && isIOS && Keyboard.removeAllListeners();
		};
	}, [offsetKeyboard]);

	/* --------------- End keyboard offset for iOS --------------- */

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
			<Fade in={isMobile && !appConnected} unmountOnExit>
				<NetworkAlert>
					<NetworkLoader />
					<StyledText
						text={ScreenTextEng.WAITING_NETWORK}
						variant="subtitle2"
						padding="0px 0px 0px 10px"
					/>
				</NetworkAlert>
			</Fade>
		);
	}

	return (
		<HomeTheme>
			<Main>
				{renderNetworkLoader()}
				{(skipVerification ||
					(!isEmpty(user) && verifyingSession !== Status.PENDING)) &&
				ready ? (
					<>
						{!!title &&
							(typeof title === 'string'
								? renderDefaultTitle(title)
								: title)}
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
								<DecorButton
									Button={PrivacyButton}
									showOnHover={['', 'dh', '']}
								/>
								<DecorButton
									Button={AboutButton}
									showOnHover={['', 'db', '']}
								/>
								<DecorButton
									Button={HelpButton}
									showOnHover={['', 'df', '']}
								/>
							</>
						) : (
							<BackButton
								style={{ fontSize: 13, padding: 0 }}
								callback={customBack}
							/>
						)}
					</BottomSpec>
				)}
				{showHomeAlert && (
					<SingleActionModal
						show={showHomeAlert}
						text={homeAlert}
						buttonText={HomeScreenText.OK}
						action={() => setShowHomeAlert(false)}
					/>
				)}
			</Main>
		</HomeTheme>
	);
};

export default HomePage;
