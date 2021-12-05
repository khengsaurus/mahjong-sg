import Fade from '@material-ui/core/Fade';
import { history } from 'App';
import isEmpty from 'lodash.isempty';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { useCallback } from 'react';
import { Page } from 'shared/enums';
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

	/* ----------------------------------- Markup ----------------------------------- */

	return (
		game &&
		player && (
			<>
				<TopRightControls {...topRight} />
				<TopLeftControls {...topLeft} />
				{showBottomControls && <BottomLeftControls {...bottomLeft} />}
				{showBottomControls && <BottomRightControls {...bottomRight} />}
				{payModal.show && (
					<Fade in timeout={300} unmountOnExit>
						<PaymentModal {...payModal} />
					</Fade>
				)}
				{settingsModal.show && (
					<Fade in timeout={300} unmountOnExit>
						<SettingsWindow {...settingsModal} />
					</Fade>
				)}
				{declareHuModal.show && isEmpty(game?.hu) && (
					<Fade in timeout={300} unmountOnExit>
						<DeclareHuModal {...declareHuModal} />
					</Fade>
				)}
				{adminControlsModal.show && (
					<Fade in timeout={300} unmountOnExit>
						<AdminControls {...adminControlsModal} />
					</Fade>
				)}
				{showAnnounceHuModal && (
					<Fade in timeout={300} unmountOnExit>
						<AnnounceHuModal {...announceHuModal} />
					</Fade>
				)}
				{notif !== '' && (
					<Fade in timeout={300} unmountOnExit>
						<TableNotif notif={notif} />
					</Fade>
				)}
			</>
		)
	);
};

export default Controls;
