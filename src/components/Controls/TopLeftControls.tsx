import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useContext } from 'react';
import { Notification, TableText } from '../../global/StyledComponents';
import { AppContext } from '../../util/hooks/AppContext';
import './controls.scss';

interface TopLeftControlsProps {
	homeCallback: () => void;
	settingsCallback: () => void;
	texts?: string[];
	notif?: string;
}

const TopLeftControls = ({ homeCallback, settingsCallback, texts, notif }: TopLeftControlsProps) => {
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`top-left-controls-${controlsSize}`}>
			<div className="buttons">
				<IconButton className="icon-button" onClick={homeCallback} disableRipple>
					<HomeIcon fontSize={controlsSize} />
				</IconButton>
				<IconButton className="icon-button" onClick={settingsCallback} disableRipple>
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
