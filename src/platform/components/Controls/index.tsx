import { history } from 'App';
import { Loader } from 'platform/components/Loader';
import AnnounceHuModal from 'platform/components/Modals/AnnounceHuModal';
import DeclareHuModal from 'platform/components/Modals/DeclareHuModal';
import PaymentModal from 'platform/components/Modals/PaymentModal';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useCallback } from 'react';
import { Pages } from 'shared/enums';
import { useControlsLogic } from 'shared/hooks';
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
		announceHuModal,
		showBottomControls,
		showAnnounceHuModal
	} = useControlsLogic(handleHome);

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
