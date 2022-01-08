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
import { Offset, Page, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore, setGame, setGameId, setLocalGame } from 'shared/store';
import { setTHK } from 'shared/store/actions';
import './home.scss';

interface IHomePage {
	markup: () => React.FC | JSX.Element;
	ready?: boolean;
	timeout?: number;
	fallbackTitle?: string;
	skipVerification?: boolean;
	offset?: string | number;
	landscapeOnly?: boolean;
}

const HomePage = ({
	markup,
	ready = true,
	timeout = 1500,
	fallbackTitle = HomeScreenText.SOMETHING_WENT_WRONG,
	skipVerification = false,
	offset = 0
}: IHomePage) => {
	const { user } = useSelector((state: IStore) => state);
	const { setPlayers } = useContext(AppContext);
	const { verifyingSession, isAppConnected } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const marginBottom = offset || process.env.REACT_APP_PLATFORM === Platform.MOBILE ? Offset.HOMEPAGE_MOBILE : null;
	const dispatch = useDispatch();

	// Reset store/AppContext on leaving game since Table useEffect cleanup is used for subscription
	useEffect(() => {
		setPlayers([user]);
		dispatch(setGameId(''));
		dispatch(setTHK(111));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	// Listener for Android back button
	useAndroidBack(() => {
		history.push(Page.HOME);
	});

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

	const DisconnectedAlert = () => (
		<div className="top-alert">
			<Row>
				<NetworkLoader />
				<StyledText title="Waiting for network..." variant="subtitle2" padding="0px 0px 0px 10px" />
			</Row>
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				{(skipVerification || (!isEmpty(user) && verifyingSession !== Status.PENDING)) && ready ? (
					<>
						<Fade in={!skipVerification && !isAppConnected} unmountOnExit>
							<DisconnectedAlert />
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
