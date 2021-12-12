import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import isEmpty from 'lodash.isempty';
import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { HomeButton, Title } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import './home.scss';

interface IHomePage {
	markup: () => React.FC | JSX.Element;
	ready?: boolean;
	timeout?: number;
	fallbackTitle?: string;
	offsetKeyboard?: number;
	skipVerification?: boolean;
}

const HomePage = ({
	markup,
	ready = true,
	timeout = 1500,
	fallbackTitle = `Whoops, something went wrong...`,
	offsetKeyboard = 0,
	skipVerification = false
}: IHomePage) => {
	const { user } = useContext(AppContext);
	const { verifyingSession } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const [marginBottom, setMarginBottom] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const keyboardAvail = Capacitor.isPluginAvailable('Keyboard') || false;

	useEffect(() => {
		if (keyboardAvail) {
			Keyboard.addListener('keyboardDidShow', info => {
				setMarginBottom(info?.keyboardHeight - offsetKeyboard);
			});
			Keyboard.addListener('keyboardDidHide', () => {
				setMarginBottom(0);
			});
		}
		return () => {
			if (keyboardAvail) {
				Keyboard.removeAllListeners();
			}
		};
	}, [keyboardAvail, offsetKeyboard]);

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
					<Centered style={{ marginBottom: marginBottom }}>{markup()}</Centered>
				) : (
					pendingScreen
				)}
			</Main>
		</HomeTheme>
	);
};

export default HomePage;
