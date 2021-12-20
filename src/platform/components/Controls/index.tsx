import Fade from '@material-ui/core/Fade';
import { history } from 'App';
import isEmpty from 'lodash.isempty';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { useCallback, useEffect } from 'react';
import { Page, Timeout } from 'shared/enums';
import { useControls } from 'shared/hooks';
import AdminControls from '../AdminControls';
import { BottomLeftControls, BottomRightControls, TopLeftControls, TopRightControls } from './Controls';
import './controls.scss';
import TableNotif from './TableNotif';

const Controls = () => {
	const handleHome = useCallback(() => {
		history.push(Page.INDEX);
	}, []);

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
		showAnnounceHuModal
	} = useControls(handleHome);

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
				{notif !== '' && (
					<Fade in timeout={Timeout.FAST} unmountOnExit>
						<TableNotif notif={notif} />
					</Fade>
				)}
			</>
		)
	);
};

export default Controls;
