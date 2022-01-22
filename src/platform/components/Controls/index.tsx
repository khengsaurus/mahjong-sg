import { Fade } from '@mui/material';
import { history } from 'App';
import { isEmpty } from 'lodash';
import GameInfo from 'platform/components/Modals/GameInfo';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import TableNotif from 'platform/components/Modals/TableNotif';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { useAndroidBack, useDocumentListener } from 'platform/hooks';
import ServiceInstance from 'platform/service/ServiceLayer';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { EEvent, LocalFlag, Page, Shortcut, Transition } from 'shared/enums';
import { useBot, useControls, useGameCountdown, useHand, useHuLocked, useNotifs, useTAvail } from 'shared/hooks';
import { IStore } from 'shared/store';
import LeaveAlert from '../Modals/LeaveAlert';
import { BottomLeftControls, BottomRightControls, TopLeftControls, TopRightControls } from './Controls';
import './controls.scss';

const Controls = () => {
	const isLocalGame = LocalFlag === useSelector((store: IStore) => store.gameId);
	const { lThAvail, lThAvailHu } = useTAvail();
	const { isHuLocked } = useHuLocked();
	const { delayLeft } = useGameCountdown();
	const updateGame = useCallback(game => ServiceInstance.updateGame(game, isLocalGame), [isLocalGame]);
	const notifOutput = useNotifs(delayLeft, lThAvail, isHuLocked);

	const handleHome = useCallback(() => {
		history.push(Page.INDEX);
	}, []);

	const { HH, HHStr } = useHand();
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
		setExec
	} = useControls(lThAvail, lThAvailHu, delayLeft, isHuLocked, HHStr, updateGame, handleHome, notifOutput);
	useBot(isHuLocked, lThAvail, setExec);

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
				{showBottomControls && <BottomLeftControls {...bottomLeft} />}
				{showBottomControls && <BottomRightControls {...bottomRight} />}
				<Fade in={payModal?.show} timeout={Transition.FAST} unmountOnExit>
					<div>
						<PaymentModal {...payModal} />
					</div>
				</Fade>
				<Fade in={settingsModal?.show} timeout={Transition.FAST} unmountOnExit>
					<div>
						<SettingsWindow {...settingsModal} />
					</div>
				</Fade>
				<Fade in={declareHuModal?.show && isEmpty(game?.hu)} timeout={Transition.FAST} unmountOnExit>
					<div>
						<DeclareHuModal HH={HH} {...declareHuModal} />
					</div>
				</Fade>
				<Fade in={gameInfoModal?.show} timeout={Transition.FAST} unmountOnExit>
					<div>
						<GameInfo {...gameInfoModal} />
					</div>
				</Fade>
				<Fade in={showAnnounceHuModal} timeout={Transition.FAST} unmountOnExit>
					<div>
						<AnnounceHuModal HH={HH} {...announceHuModal} />
					</div>
				</Fade>
				<Fade in={Number(notif?.timeout) > 0} timeout={Transition.FAST} unmountOnExit>
					<div>
						<TableNotif {...notif} />
					</div>
				</Fade>
				<Fade in={showLeaveAlert} timeout={Transition.FAST} unmountOnExit>
					<div>
						<LeaveAlert show={showLeaveAlert} onClose={() => topLeft?.setShowLeaveAlert(false)} />
					</div>
				</Fade>
			</>
		)
	);
};

export default Controls;
