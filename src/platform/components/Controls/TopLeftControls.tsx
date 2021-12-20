import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TableText } from 'platform/style/StyledComponents';
import { useContext } from 'react';
import { Size } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import './controls.scss';

interface IHasFontSize {
	fontSize: Size;
}
interface IControlsButton {
	Icon: React.FC<IHasFontSize>;
	onClick: () => void;
	size: Size;
}

const ControlsButton = ({ Icon, onClick, size }: IControlsButton) => (
	<IconButton className="icon-button" onClick={onClick} disableRipple>
		<Icon fontSize={size} />
	</IconButton>
);

const TopLeftControls = ({
	handleHome,
	handleSettings,
	handleScreenText,
	handleAdmin,
	showText,
	isAdmin,
	texts
}: ITopLeftControls) => {
	const { controlsSize: size } = useContext(AppContext);

	return (
		<div className={`top-left-controls-${size}`}>
			<div className="buttons">
				<ControlsButton Icon={HomeIcon} onClick={handleHome} size={size} />
				<ControlsButton Icon={SettingsIcon} onClick={handleSettings} size={size} />
				<ControlsButton
					Icon={showText ? VisibilityIcon : VisibilityOffIcon}
					onClick={handleScreenText}
					size={size}
				/>
				{isAdmin && <ControlsButton Icon={EditIcon} onClick={handleAdmin} size={size} />}
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
