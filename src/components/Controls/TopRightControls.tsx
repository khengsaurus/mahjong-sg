import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SubjectIcon from '@material-ui/icons/Subject';
import React from 'react';
import { Sizes } from '../../global/enums';
import { scrollToBottomOfDiv } from '../../util/utilFns';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';
import LogBox from './LogBox';

interface TopRightControlsProps {
	controlsSize: Sizes;
	payCallback: () => void;
	logsCallback: () => void;
	showLogs: boolean;
	logs: Log[];
}

const TopRightControls = (props: TopRightControlsProps) => {
	const { controlsSize, payCallback, logsCallback, showLogs, logs } = props;
	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<>
				<IconButton className="icon-button" size="small" onClick={payCallback}>
					<MonetizationOnIcon />
				</IconButton>
				<IconButton className="icon-button" size="small" onClick={logsCallback}>
					<SubjectIcon />
				</IconButton>
				<LogBox
					expanded={showLogs}
					logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
					scroll={() => {
						scrollToBottomOfDiv('logs');
					}}
					size={controlsSize || Sizes.medium}
				/>
			</>
		</div>
	);
};

export default TopRightControls;
