import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Fade } from '@material-ui/core';
import { history } from 'App';
import { isEmpty } from 'lodash';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { Loader, NetworkLoader } from 'platform/components/Loader';
import { useAndroidBack, useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main, Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EEvent, Page, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore, setGame, setGameId, setLocalGame } from 'shared/store';
import { setTHK } from 'shared/store/actions';
import './home.scss';

interface HomePageProps {
	markup: () => React.FC | JSX.Element;
	ready?: boolean;
	timeout?: number;
	fallbackTitle?: string;
	skipVerification?: boolean;
	offsetKeyboard?: number;
	landscapeOnly?: boolean;
}

const HomePage = ({
	markup,
	ready = true,
	timeout = 1500,
	fallbackTitle = HomeScreenText.SOMETHING_WENT_WRONG,
	skipVerification = false,
	offsetKeyboard = 0
}: HomePageProps) => {
	const { user } = useSelector((state: IStore) => state);
	const { setPlayers } = useContext(AppContext);
	const { verifyingSession, isAppConnected } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const dispatch = useDispatch();

	/* -------------------- Keyboard offset for iOS + Android back button handling -------------------- */
	const [marginBottom, setMarginBottom] = useState(0);
	const keyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;
	const isIOS = Capacitor.getPlatform() === Platform.IOS;

	useEffect(() => {
		if (keyboardAvail && isIOS) {
			Keyboard.addListener(EEvent.KEYBOARDSHOW, info => {
				const keyboardHeight = Number(info?.keyboardHeight) || 0;
				const windowHeight = window?.screen?.height || 0;
				const ratio =
					keyboardHeight > 0.4 * windowHeight
						? 0.9
						: [
								ScreenOrientation.ORIENTATIONS.LANDSCAPE,
								ScreenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY,
								ScreenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY
						  ].includes(ScreenOrientation.type)
						? 0.6
						: 0;
				if (Number(keyboardHeight)) {
					setMarginBottom(keyboardHeight * ratio - offsetKeyboard);
				}
			});
			Keyboard.addListener(EEvent.KEYBOARDHIDE, () => {
				setMarginBottom(0);
			});
		}
		return () => {
			if (keyboardAvail && isIOS) {
				Keyboard.removeAllListeners();
			}
		};
	}, [isIOS, keyboardAvail, offsetKeyboard]);

	useAndroidBack(() => {
		history.push(Page.HOME);
	});

	/* ------------------ End keyboard offset for iOS + Android back button handling ------------------ */

	// Reset store/AppContext on leaving game since Table useEffect cleanup is used for subscription
	useEffect(() => {
		setPlayers([user]);
		dispatch(setGameId(''));
		dispatch(setTHK(111));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	useEffect(() => {
		if (!ready) {
			timeoutRef.current = setTimeout(() => {
				setPendingScreen(
					<Centered>
						<StyledText title={fallbackTitle} variant="subtitle1" />
						<HomeButton />
					</Centered>
				);
			}, timeout);
		}

		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [ready, fallbackTitle, timeout]);

	return (
		<HomeTheme>
			<Main>
				{(skipVerification || (!isEmpty(user) && verifyingSession !== Status.PENDING)) && ready ? (
					<>
						<Fade in={!skipVerification && !isAppConnected} unmountOnExit>
							<div className="top-alert">
								<Row>
									<NetworkLoader />
									<StyledText
										title="Waiting for network..."
										variant="subtitle2"
										padding="0px 0px 0px 10px"
									/>
								</Row>
							</div>
						</Fade>
						<Centered style={{ marginBottom }}>{markup()}</Centered>
					</>
				) : (
					pendingScreen
				)}
			</Main>
		</HomeTheme>
	);
};

export default HomePage;
