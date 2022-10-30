import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconControlButton } from 'components';
import { LocalFlag, Size } from 'enums';
import { AppContext } from 'hooks';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { TableText } from 'style/StyledComponents';
import './controls.scss';

const TopLeftControls = ({
	toggleShowSettings: handleSettings,
	toggleShowScreenText: handleScreenText,
	toggleShowAdmin: handleAdmin,
	setShowLeaveAlert,
	showText,
	texts
}: ITLControlsP) => {
	const {
		gameId,
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const { annHuOpen, handleHome } = useContext(AppContext);

	function goHome() {
		if (gameId === LocalFlag) {
			setShowLeaveAlert(true);
		} else {
			handleHome();
		}
	}

	return (
		<div className={`top-left-controls-${controlsSize}`}>
			<div className="buttons">
				<IconControlButton Icon={HomeIcon} onClick={goHome} size={controlsSize} />
				<IconControlButton
					Icon={InfoIcon}
					onClick={handleAdmin}
					size={controlsSize}
				/>
				<IconControlButton
					Icon={SettingsIcon}
					onClick={handleSettings}
					size={controlsSize}
				/>
				<IconControlButton
					Icon={showText && !annHuOpen ? VisibilityIcon : VisibilityOffIcon}
					onClick={handleScreenText}
					size={controlsSize}
				/>
			</div>
			{showText && !annHuOpen && (
				<div className="text-container">
					{texts?.map((text, index) => (
						<TableText className="text" key={`top-left-text-${index}`}>
							{text}
						</TableText>
					))}
				</div>
			)}
		</div>
	);
};

export default TopLeftControls;
