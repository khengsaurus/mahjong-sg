import isEmpty from 'lodash.isempty';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Offset, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
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

// Disabling keyboard offset
const HomePage = ({
	markup,
	ready = true,
	timeout = 1500,
	fallbackTitle = `Whoops, something went wrong...`,
	skipVerification = false,
	offset = 0
}: IHomePage) => {
	const { user } = useContext(AppContext);
	const { verifyingSession } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	// const [marginBottom, setMarginBottom] = useState(0);
	// const keyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;
	const marginBottom = offset || process.env.REACT_APP_PLATFORM === Platform.MOBILE ? Offset.HOMEPAGE_MOBILE : null;

	// useEffect(() => {
	// 	if (keyboardAvail) {
	// 		Keyboard.addListener('keyboardDidShow', info => {
	// 			setMarginBottom(info?.keyboardHeight - offsetKeyboard);
	// 		});
	// 		Keyboard.addListener('keyboardDidHide', () => { setMarginBottom(0); });
	// 	}
	// 	return () => { if (keyboardAvail) { Keyboard.removeAllListeners(); }};
	// }, [keyboardAvail, offsetKeyboard]);

	const FallbackScreen = useMemo(
		() => (
			<Centered>
				<Title title={fallbackTitle} variant="subtitle1" />
				<HomeButton />
			</Centered>
		),
		[fallbackTitle]
	);

	useEffect(() => {
		if (!ready) {
			timeoutRef.current = setTimeout(() => {
				setPendingScreen(FallbackScreen);
			}, timeout);
		}

		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [ready, FallbackScreen, timeout]);

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
