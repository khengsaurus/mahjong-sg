import useControlsLogic from 'shared/util/hooks/useControlsLogic';
import { Loader } from 'web/components/Loader';
import AnnounceHuModal from 'web/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'web/components/Modals/DeclareHuModal';
import PaymentModal from 'web/components/Modals/PaymentModal';
import SettingsWindow from 'web/components/SettingsWindow/SettingsWindow';
import { TableTheme } from 'web/style/MuiStyles';
import { MainTransparent } from 'web/style/StyledComponents';
import BottomLeftControls from './BottomLeftControls';
import BottomRightControls from './BottomRightControls';
import './controls.scss';
import TopLeftControls from './TopLeftControls';
import TopRightControls from './TopRightControls';

const Controls = () => {
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
		announceHuModal,
		showBottomControls,
		showAnnounceHuModal
	} = useControlsLogic();

	/* ----------------------------------- Markup ----------------------------------- */

	return (
		<TableTheme>
			{game && player ? (
				<MainTransparent>
					<TopRightControls {...topRight} />
					<TopLeftControls {...topLeft} />
					{showBottomControls && <BottomLeftControls {...bottomLeft} />}
					{showBottomControls && <BottomRightControls {...bottomRight} />}
					{payModal.show && <PaymentModal {...payModal} />}
					{settingsModal.show && <SettingsWindow {...settingsModal} />}
					{declareHuModal.show && <DeclareHuModal {...declareHuModal} />}
					{showAnnounceHuModal && <AnnounceHuModal {...announceHuModal} />}
				</MainTransparent>
			) : (
				<Loader />
			)}
		</TableTheme>
	);
};

export default Controls;
