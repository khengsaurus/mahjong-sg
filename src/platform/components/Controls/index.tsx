import { Fade } from '@mui/material';
import { history } from 'App';
import { isEmpty } from 'lodash';
import AdminControls from 'platform/components/Modals/AdminControls';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import TableNotif from 'platform/components/Modals/TableNotif';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import ServiceInstance from 'platform/service/ServiceLayer';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag, Page, Shortcut, Timeout } from 'shared/enums';
import { useBot, useControls, useGameCountdown, useHand, useHuLocked, useTAvail } from 'shared/hooks';
import { IStore } from 'shared/store';
import { BottomLeftControls, BottomRightControls, TopLeftControls, TopRightControls } from './Controls';
import './controls.scss';

const Controls = () => {
	const isLocalGame = LocalFlag === useSelector((store: IStore) => store.gameId);
	const { lThAvail, lThAvailHu } = useTAvail();
	const { isHuLocked } = useHuLocked();
	const updateGame = useCallback(game => ServiceInstance.updateGame(game, isLocalGame), [isLocalGame]);
	const { delayOn, delayLeft } = useGameCountdown(updateGame);

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
		adminControlsModal,
		declareHuModal,
		announceHuModal,
		showBottomControls,
		showAnnounceHuModal,
		setExec
	} = useControls(lThAvail, lThAvailHu, delayOn, delayLeft, isHuLocked, HH, HHStr, updateGame, handleHome);
	useBot(isHuLocked, lThAvail, setExec);

	const handleKeyListeners = useCallback(
		e => {
			switch (e.key) {
				case Shortcut.ADMIN:
					if (topLeft?.isAdmin) {
						topLeft?.handleAdmin();
					}
					break;
				case Shortcut.HOME:
					handleHome();
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

	useEffect(() => {
		document.addEventListener('keydown', handleKeyListeners);
		return () => {
			document.removeEventListener('keydown', handleKeyListeners);
		};
	}, [handleKeyListeners]);

	/* ----------------------------------- Markup ----------------------------------- */

	return (
		game &&
		player && (
			<>
				<TopRightControls {...topRight} />
				<TopLeftControls {...topLeft} />
				{showBottomControls && <BottomLeftControls {...bottomLeft} />}
				{showBottomControls && <BottomRightControls {...bottomRight} />}
				<Fade in={payModal.show} timeout={Timeout.FAST} unmountOnExit>
					<div>
						<PaymentModal {...payModal} />
					</div>
				</Fade>
				<Fade in={settingsModal.show} timeout={Timeout.FAST} unmountOnExit>
					<div>
						<SettingsWindow {...settingsModal} />
					</div>
				</Fade>
				<Fade in={declareHuModal.show && isEmpty(game?.hu)} timeout={Timeout.FAST} unmountOnExit>
					<div>
						<DeclareHuModal {...declareHuModal} />
					</div>
				</Fade>
				<Fade in={adminControlsModal.show} timeout={Timeout.FAST} unmountOnExit>
					<div>
						<AdminControls {...adminControlsModal} />
					</div>
				</Fade>
				<Fade in={showAnnounceHuModal} timeout={Timeout.FAST} unmountOnExit>
					<div>
						<AnnounceHuModal {...announceHuModal} />
					</div>
				</Fade>
				{/* <Fade in={Number(notif?.timeout) > 0} timeout={Timeout.FAST} unmountOnExit> */}
				<Fade in timeout={Timeout.FAST} unmountOnExit>
					<div>
						<TableNotif {...notif} />
					</div>
				</Fade>
			</>
		)
	);
};

export default Controls;
