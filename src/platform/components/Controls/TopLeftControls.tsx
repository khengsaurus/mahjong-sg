import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import { Notification, TableText } from 'platform/style/StyledComponents';
import { useContext } from 'react';
import { AppContext } from 'shared/hooks/AppContext';
import './controls.scss';

const TopLeftControls = ({ handleHome, handleSettings, texts, notif }: ITopLeftControls) => {
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
				{notif !== '' && (
					<Fade in timeout={400}>
						<Notification className="notif">
							<TableText className="text">{notif}</TableText>
						</Notification>
					</Fade>
				)}
			</div>
			<div className="text-container">
				{texts?.map((text, index) => {
					return (
						<TableText className="text" key={`top-left-text-${index}`}>
							{text}
						</TableText>
					);
				})}
			</div>
		</div>
	);
};

export default TopLeftControls;
