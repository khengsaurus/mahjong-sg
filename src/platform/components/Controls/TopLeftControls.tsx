import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconControlButton from 'platform/components/Buttons/IconControlButton';
import { TableText } from 'platform/style/StyledComponents';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag, Size } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import './controls.scss';

const TopLeftControls = ({
	handleSettings,
	handleScreenText,
	handleAdmin,
	setShowLeaveAlert,
	showText,
	texts
}: TLControlsProps) => {
	const {
		gameId,
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const { handleHome } = useContext(AppContext);

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
				<IconControlButton Icon={InfoIcon} onClick={handleAdmin} size={controlsSize} />
				<IconControlButton Icon={SettingsIcon} onClick={handleSettings} size={controlsSize} />
				<IconControlButton
					Icon={showText ? VisibilityIcon : VisibilityOffIcon}
					onClick={handleScreenText}
					size={controlsSize}
				/>
			</div>
			{showText && (
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
