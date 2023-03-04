import {
	AboutButton,
	BackButton,
	DecorButton,
	HelpButton,
	HomeButton,
	Loader,
	Overlay,
	PrivacyButton,
	SingleActionModal
} from 'components';
import { Status } from 'enums';
import { AppContext, useLocalSession } from 'hooks';
import isEmpty from 'lodash.isempty';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import { HomeTheme } from 'style/MuiStyles';
import { BottomSpecs, Centered, Main } from 'style/StyledComponents';
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
	const { homeAlert, setAnnHuOpen, showHomeAlert, setShowHomeAlert } =
		useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const { verifyingSession } = useLocalSession(skipVerification);
	const [pendingScreen, setPendingScreen] = useState<React.FC | JSX.Element>(
		<Loader />
	);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	/* ------------------------- Screen orientation ------------------------- */

	useEffect(() => {
		setAnnHuOpen(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	return (
		<HomeTheme>
			<Main>
				{(skipVerification ||
					(!isEmpty(user) && verifyingSession !== Status.PENDING)) &&
				ready ? (
					<>
						{!!title &&
							(typeof title === 'string'
								? renderDefaultTitle(title)
								: title)}
						<Centered>{markup()}</Centered>
						<Overlay />
					</>
				) : (
					pendingScreen
				)}
				{misc !== 3 && (
					<BottomSpecs id="bottom-specs">
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
					</BottomSpecs>
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
