import { Fade } from '@mui/material';
import { history } from 'App';
import isEmpty from 'lodash.isempty';
import AdminControls from 'platform/components/Modals/AdminControls';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import TableNotif from 'platform/components/Modals/TableNotif';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import ServiceInstance from 'platform/service/ServiceLayer';
import { useCallback, useContext, useEffect } from 'react';
import { Page, Timeout } from 'shared/enums';
import { AppContext, useBot, useControls, useGameCountdown, useHand, useHuLocked, useTAvail } from 'shared/hooks';
import { BottomLeftControls, BottomRightControls, TopLeftControls, TopRightControls } from './Controls';
import './controls.scss';

const Controls = () => {
	const { isLocalGame } = useContext(AppContext);
	const { lThAvail, lThAvailHu } = useTAvail();
	const { delayOn, delayLeft } = useGameCountdown();
	const { isHuLocked } = useHuLocked();

	const updateGame = useCallback(
		game => {
			ServiceInstance.updateGame(game, isLocalGame);
		},
		[isLocalGame]
	);

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
	useBot(lThAvail, setExec);

	const handleKeyListeners = useCallback(
		e => {
			switch (e.key) {
				case 'a':
					if (topLeft?.isAdmin) {
						topLeft?.handleAdmin();
					}
					break;
				case 'q':
				case 'h':
					handleHome();
					break;
				case 'p':
					topRight?.handlePay();
					break;
				case 'v':
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
