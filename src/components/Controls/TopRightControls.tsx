import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SubjectIcon from '@material-ui/icons/Subject';
import React, { useContext } from 'react';
import { Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import { scrollToBottomOfDiv } from '../../util/utilFns';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';
import LogBox from './LogBox';

interface TopRightControlsProps {
	payCallback: () => void;
	logsCallback: () => void;
	showLogs: boolean;
	logs: Log[];
}

const TopRightControls = (props: TopRightControlsProps) => {
	const { payCallback, logsCallback, showLogs, logs } = props;
	const { controlsSize, tableColor } = useContext(AppContext);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<>
				<IconButton color="primary" className="icon-button" onClick={payCallback}>
					<MonetizationOnIcon />
				</IconButton>
				<IconButton color="primary" className="icon-button" onClick={logsCallback}>
					<SubjectIcon />
				</IconButton>
				<LogBox
					expanded={showLogs}
					logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
					scroll={() => {
						scrollToBottomOfDiv('logs');
					}}
					size={controlsSize || Sizes.medium}
					tableColor={tableColor}
				/>
			</>
		</div>
	);
};

export default TopRightControls;
