import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useContext } from 'react';
import { TableText } from '../../global/StyledComponents';
import { AppContext } from '../../util/hooks/AppContext';
import './controls.scss';

interface TopLeftControlsProps {
	homeCallback: () => void;
	settingsCallback: () => void;
	texts?: string[];
}

const TopLeftControls = (props: TopLeftControlsProps) => {
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`top-left-controls-${controlsSize}`}>
			<div className="buttons">
				<IconButton className="icon-button" onClick={props.homeCallback} disableRipple>
					<HomeIcon fontSize={controlsSize} />
				</IconButton>
				<IconButton className="icon-button" onClick={props.settingsCallback} disableRipple>
					<SettingsIcon fontSize={controlsSize} />
				</IconButton>
			</div>
			<div className="text-container">
				{props.texts?.map((text, index) => {
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
