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
		declareHuModal,
		adminControlsModal,
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
				{payModal.show && <PaymentModal {...payModal} />}
				{settingsModal.show && <SettingsWindow {...settingsModal} />}
				{declareHuModal.show && isEmpty(game?.hu) && <DeclareHuModal {...declareHuModal} />}
				{adminControlsModal.show && <AdminControls {...adminControlsModal} />}
				{showAnnounceHuModal && <AnnounceHuModal {...announceHuModal} />}
				{notif !== '' && <TableNotif notif={notif} />}
			</>
		)
	);
};

export default Controls;
