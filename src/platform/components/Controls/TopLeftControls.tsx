import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconControlButton from 'platform/components/Buttons/IconControlButton';
import { TableText } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { LocalFlag, Size } from 'shared/enums';
import { IStore } from 'shared/store';
import './controls.scss';

const TopLeftControls = ({
	handleHome,
	handleSettings,
	handleScreenText,
	handleAdmin,
	setShowLeaveAlert,
	showText,
	isAdmin,
	texts
}: TLControlsProps) => {
	const {
		gameId,
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);

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
				<IconControlButton Icon={SettingsIcon} onClick={handleSettings} size={controlsSize} />
				<IconControlButton Icon={InfoIcon} onClick={handleAdmin} size={controlsSize} />
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
