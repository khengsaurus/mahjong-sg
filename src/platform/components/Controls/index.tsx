import { Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import {
	AnnounceHuModal,
	DeclareHuModal,
	GameInfo,
	LeaveAlert,
	OfferChiModal,
	PaymentModal,
	SingleActionModal,
	TableNotif
} from 'platform/components/Modals';
import SettingsWindow from 'platform/components/SettingsWindow';
import { useAndroidBack, useDocumentListener } from 'platform/hooks';
import ServiceInstance from 'platform/service/ServiceLayer';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BotIds, EEvent, LocalFlag, Shortcut, Transition } from 'shared/enums';
import {
	AppContext,
	useBot,
	useControls,
	useGameCountdown,
	useHand,
	useHuLocked,
	useNotifs,
	useTAvail
} from 'shared/hooks';
import { ButtonText, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { getCardName } from 'shared/util';
import ChiAlert from './ChiAlert';
import { BottomLeftControls, BottomRightControls, TopLeftControls, TopRightControls } from './Controls';
import './controls.scss';

interface IFadeWrapperProps {
	show: boolean;
	Component: JSX.Element | React.FC;
	unmountOnExit?: boolean;
	wrapperClass?: string;
}

function FadeWrapper({ Component, show, unmountOnExit = true, wrapperClass = '' }: IFadeWrapperProps) {
	return (
		<Fade in={show} timeout={Transition.FAST} unmountOnExit={unmountOnExit}>
			<div className={wrapperClass}>{Component}</div>
		</Fade>
	);
}

const Controls = () => {
	const { gameId, sizes, user } = useSelector((store: IStore) => store);
	const { lThAvail, lThAvailHu } = useTAvail();
	const { isHuLocked } = useHuLocked();
	const { delayLeft } = useGameCountdown();
	const { handleHome } = useContext(AppContext);

	const isLocalGame = useMemo(() => gameId === LocalFlag, [gameId]);
	const updateGame = useCallback(game => ServiceInstance.updateGame(game, isLocalGame), [isLocalGame]);
	const notifOutput = useNotifs(delayLeft, lThAvail, isHuLocked);
	const { showChiAlert, setShowChiAlert, toChi } = notifOutput;

	const { HH } = useHand();
	const {
		game,
		notif,
		player,
		topRight,
		topLeft,
		bottomLeft,
		bottomRight,
		payModal,
		settingsModal,
		gameInfoModal,
		declareHuModal,
		announceHuModal,
		showLeaveAlert,
		showBottomControls,
		showAnnounceHuModal,
		handleChi,
		setExec,
		setGamePaused
	} = useControls(lThAvail, lThAvailHu, delayLeft, isHuLocked, notifOutput, HH, updateGame);
	useBot(isHuLocked, lThAvail, setExec);
	const { cO, f = [], hu = [], lTh = {}, n = [], ps = [] } = game || {};

	const [showOfferChi, setShowOfferChi] = useState(false);
	const [showStart, setShowStart] = useState(false);
	const [startPrompt, setStartPrompt] = useState('');
	const [startButtonText, setStartButtonText] = useState('');

	useEffect(() => {
		const first_p = ps[n[3]];
		const botToGoFirst = BotIds.includes(first_p?.id);
		if (f[1]) {
			setShowStart(hu.length < 3 && (botToGoFirst || first_p.uN !== user.uN));
			setStartPrompt(
				cO === user?.uN && botToGoFirst
					? ScreenTextEng.START_PROMPT
					: first_p.uN === user?.uN
					? ScreenTextEng.DISCARD_TO_START
					: `Waiting for ${first_p.uN} to start the round`
			);
			setStartButtonText(cO === user?.uN && botToGoFirst ? ButtonText.START : '');
		} else {
			setShowStart(false);
			setStartPrompt('');
			setStartButtonText('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cO, f[1], ps[n[3]]?.id, user?.uN]);

	const _handleHome = useCallback(() => {
		if (isLocalGame) {
			topLeft?.setShowLeaveAlert(true);
		} else {
			handleHome();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLocalGame, topLeft?.setShowLeaveAlert, handleHome]);

	const handleKeyListeners = useCallback(
		e => {
			switch (e.key) {
				case Shortcut.INFO:
					topLeft?.handleAdmin();
					break;
				case Shortcut.HOME:
					_handleHome();
					break;
				case Shortcut.PAY:
					topRight?.handlePay();
					break;
				case Shortcut.SETTINGS:
					topLeft?.handleSettings();
					break;
				case Shortcut.TEXT:
					topRight?.handleLogs();
					break;
				case Shortcut.VIEW:
					topLeft?.handleScreenText();
					break;
				default:
					break;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleHome, topLeft?.handleAdmin, topRight?.handlePay, topLeft?.handleScreenText]
	);
	useDocumentListener(EEvent.KEYDOWN, handleKeyListeners);
	useAndroidBack(_handleHome);

	/* ----------------------------------- Markup ----------------------------------- */

	return (
		game &&
		player && (
			<>
				<TopRightControls {...topRight} />
				<TopLeftControls {...topLeft} />
				{showBottomControls && <BottomLeftControls {...bottomLeft} setShowChiAlert={setShowChiAlert} />}
				{showBottomControls && (
					<BottomRightControls
						{...bottomRight}
						showChiAlert={showChiAlert}
						setShowChiAlert={setShowChiAlert}
					/>
				)}
				<FadeWrapper show={payModal?.show} Component={<PaymentModal {...payModal} />} />
				<FadeWrapper show={settingsModal?.show} Component={<SettingsWindow {...settingsModal} />} />
				<FadeWrapper
					show={declareHuModal?.show && isEmpty(hu)}
					Component={<DeclareHuModal HH={HH} {...declareHuModal} />}
				/>
				<FadeWrapper show={gameInfoModal?.show} Component={<GameInfo {...gameInfoModal} />} />
				<FadeWrapper
					show={showAnnounceHuModal}
					Component={<AnnounceHuModal HH={HH} {...announceHuModal} handleHome={_handleHome} />}
				/>
				{/* <FadeWrapper show={Number(notif?.timeout) > 0} Component={<TableNotif {...notif} />} /> */}
				<FadeWrapper show={true} Component={<TableNotif {...notif} />} />
				<FadeWrapper
					show={showLeaveAlert}
					Component={<LeaveAlert show={showLeaveAlert} onClose={() => topLeft?.setShowLeaveAlert(false)} />}
				/>
				<FadeWrapper
					Component={
						<ChiAlert
							show={showChiAlert}
							handleOpenOffer={() => setShowOfferChi(true)}
							onClose={() => setShowChiAlert(false)}
						/>
					}
					show={showChiAlert}
					wrapperClass={`chi-alert-${sizes.controlsSize}`}
					unmountOnExit={false}
				/>
				<FadeWrapper
					Component={
						<OfferChiModal
							show={showOfferChi}
							card={lTh?.c ? getCardName(lTh?.c) : ''}
							ms={toChi}
							handleTake={handleChi}
							onClose={() => setShowOfferChi(false)}
						/>
					}
					show={showOfferChi}
					wrapperClass={`chi-alert-${sizes.controlsSize}`}
					unmountOnExit={true}
				/>
				<FadeWrapper
					show={showStart}
					Component={
						<SingleActionModal
							show={showStart}
							text={startPrompt}
							buttonText={startButtonText}
							action={() => setGamePaused(false)}
						/>
					}
				/>
			</>
		)
	);
};

export default Controls;
