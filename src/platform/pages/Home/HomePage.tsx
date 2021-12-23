import isEmpty from 'lodash.isempty';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Offset, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore, setGame, setGameId, setLocalGame } from 'shared/store';
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
	fallbackTitle = `Whoops, something went wrong...`,
	skipVerification = false,
	offset = 0
}: IHomePage) => {
	const { user } = useSelector((state: IStore) => state);
	const { setPlayers } = useContext(AppContext);
	const { verifyingSession } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const marginBottom = offset || process.env.REACT_APP_PLATFORM === Platform.MOBILE ? Offset.HOMEPAGE_MOBILE : null;
	const dispatch = useDispatch();

	// Reset store/AppContext on leaving game since Table useEffect cleanup is used for subscription...
	useEffect(() => {
		setPlayers([user]);
		dispatch(setGameId(''));
		dispatch(setGame(null));
		dispatch(setLocalGame(null));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, setPlayers, user?.id]);

	useEffect(() => {
		if (!ready) {
			timeoutRef.current = setTimeout(() => {
				setPendingScreen(
					<Centered>
						<Title title={fallbackTitle} variant="subtitle1" />
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
					<Centered style={{ marginBottom }}>{markup()}</Centered>
				) : (
					pendingScreen
				)}
			</Main>
		</HomeTheme>
	);
};

export default HomePage;
