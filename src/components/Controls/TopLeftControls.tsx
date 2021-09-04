import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { Sizes } from '../../global/enums';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';

interface TopLeftControlsProps {
	controlsSize: Sizes;
	homeCallback: () => void;
	settingsCallback: () => void;
	texts?: string[];
}

const TopLeftControls = (props: TopLeftControlsProps) => {
	return (
		<div className={`top-left-controls-${props.controlsSize}`}>
			<>
				<div className="buttons">
					<IconButton className="icon-button" size="small" onClick={props.homeCallback}>
						<HomeIcon />
					</IconButton>
					<IconButton className="icon-button" size="small" onClick={props.settingsCallback}>
						<SettingsIcon />
					</IconButton>
				</div>
				<div className="text-container">
					{props.texts?.map((text, index) => {
						return <p key={`top-left-text-${index}`}>{text}</p>;
					})}
				</div>
			</>
		</div>
	);
};

export default TopLeftControls;
