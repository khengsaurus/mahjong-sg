import { history } from 'App';
import { Loader } from 'platform/components/Loader';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { useCallback } from 'react';
import { Pages } from 'shared/enums';
import { useControlsLogic } from 'shared/hooks';
import AdminControls from '../AdminControls';
import BottomLeftControls from './BottomLeftControls';
import BottomRightControls from './BottomRightControls';
import './controls.scss';
import TopLeftControls from './TopLeftControls';
import TopRightControls from './TopRightControls';

const Controls = () => {
	const handleHome = useCallback(() => {
		history.push(Pages.INDEX);
	}, []);

	const {
		game,
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
	} = useControlsLogic(handleHome);

	/* ----------------------------------- Markup ----------------------------------- */

	return game && player ? (
		<>
			<TopRightControls {...topRight} />
			<TopLeftControls {...topLeft} />
			{showBottomControls && <BottomLeftControls {...bottomLeft} />}
			{showBottomControls && <BottomRightControls {...bottomRight} />}
			{payModal.show && <PaymentModal {...payModal} />}
			{settingsModal.show && <SettingsWindow {...settingsModal} />}
			{declareHuModal.show && <DeclareHuModal {...declareHuModal} />}
			{adminControlsModal.show && <AdminControls {...adminControlsModal} />}
			{showAnnounceHuModal && <AnnounceHuModal {...announceHuModal} />}
		</>
	) : (
		<Loader />
	);
};

export default Controls;
