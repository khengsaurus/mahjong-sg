import isEmpty from 'lodash.isempty';
import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { HomeButton, Title } from 'platform/style/StyledMui';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';

interface IHomePage {
	Markup: React.FC;
	ready?: boolean;
	timeout?: number;
	fallbackTitle?: string;
}

const HomePage = ({
	Markup,
	ready = true,
	timeout = 1000,
	fallbackTitle = `Whoops, something went wrong...`
}: IHomePage) => {
	const { user } = useContext(AppContext);
	const { verifyingSession } = useLocalSession();
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(<Loader />);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	const FallbackScreen = useMemo(
		() => (
			<Centered>
				<Title title={fallbackTitle} />
				<HomeButton />
			</Centered>
		),
		[fallbackTitle]
	);

	useEffect(() => {
		if (!ready) {
			timeoutRef.current = setTimeout(function () {
				setPendingScreen(FallbackScreen);
			}, timeout);
		}
		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [ready, FallbackScreen, timeout]);

	return (
		<HomeTheme>
			<Main>{!isEmpty(user) && verifyingSession !== Status.PENDING && ready ? <Markup /> : pendingScreen}</Main>
		</HomeTheme>
	);
};

export default HomePage;
