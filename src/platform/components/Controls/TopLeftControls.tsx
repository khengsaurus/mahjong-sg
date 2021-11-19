import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Notification, TableText } from 'platform/style/StyledComponents';
import { useContext } from 'react';
import { AppContext } from 'shared/hooks';
import './controls.scss';

const TopLeftControls = ({
	handleHome,
	handleSettings,
	handleScreenText,
	handleAdmin,
	showText,
	isAdmin,
	texts,
	notif
}: ITopLeftControls) => {
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`top-left-controls-${controlsSize}`}>
			<div className="buttons">
				<IconButton className="icon-button" onClick={handleHome} disableRipple>
					<HomeIcon fontSize={controlsSize} />
				</IconButton>
				<IconButton className="icon-button" onClick={handleSettings} disableRipple>
					<SettingsIcon fontSize={controlsSize} />
				</IconButton>
				<IconButton className="icon-button" onClick={handleScreenText} disableRipple>
					{showText ? (
						<VisibilityIcon fontSize={controlsSize} />
					) : (
						<VisibilityOffIcon fontSize={controlsSize} />
					)}
				</IconButton>
				{isAdmin && (
					<IconButton className="icon-button" onClick={handleAdmin} disableRipple>
						<EditIcon fontSize={controlsSize} />
					</IconButton>
				)}

				{notif !== '' && (
					<Fade in timeout={400}>
						<Notification className="notif">
							<TableText className="text">{notif}</TableText>
						</Notification>
					</Fade>
				)}
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
