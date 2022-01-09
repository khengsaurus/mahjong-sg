import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import { TableText } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { LocalFlag, Size } from 'shared/enums';
import { IStore } from 'shared/store';
import './controls.scss';

interface IHasFontSize {
	fontSize: Size;
}
interface ControlsButtonProps {
	size: Size;
	Icon: React.FC<IHasFontSize>;
	onClick: () => void;
}

const ControlsButton = ({ Icon, onClick, size }: ControlsButtonProps) => (
	<IconButton className="icon-button" onClick={onClick} disableRipple>
		<Icon fontSize={size} />
	</IconButton>
);

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
				<ControlsButton Icon={HomeIcon} onClick={goHome} size={controlsSize} />
				<ControlsButton Icon={SettingsIcon} onClick={handleSettings} size={controlsSize} />
				{isAdmin && <ControlsButton Icon={EditIcon} onClick={handleAdmin} size={controlsSize} />}
				<ControlsButton
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
