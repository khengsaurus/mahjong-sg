import { TableTheme } from '../../global/MuiStyles';
import { MainTransparent } from '../../global/StyledComponents';
import useControlsLogic from '../../util/hooks/useControlsLogic';
import { Loader } from '../Loader';
import AnnounceHuModal from '../Modals/AnnounceHuModal';
import DeclareHuModal from '../Modals/DeclareHuModal';
import PaymentModal from '../Modals/PaymentModal';
import SettingsWindow from '../SettingsWindow/SettingsWindow';
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
