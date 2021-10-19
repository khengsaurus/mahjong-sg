import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SubjectIcon from '@material-ui/icons/Subject';
import React, { useContext, useRef } from 'react';
import { Sizes } from '../../global/enums';
import { AppContext } from '../../util/hooks/AppContext';
import LogModal from '../Modals/LogModal';
import './controls.scss';

interface TopRightControlsProps {
	payCallback: () => void;
	logsCallback: () => void;
	showLogs: boolean;
	logs: ILog[];
}

const TopRightControls = (props: TopRightControlsProps) => {
	const { payCallback, logsCallback, showLogs, logs } = props;
	const { controlsSize, tableColor } = useContext(AppContext);
	const logRef = useRef(null);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<IconButton className="icon-button" onClick={payCallback} disableRipple>
				<MonetizationOnIcon fontSize={controlsSize} />
			</IconButton>
			<IconButton className="icon-button" onClick={logsCallback} disableRipple ref={logRef}>
				<SubjectIcon fontSize={controlsSize} />
			</IconButton>
			<LogModal
				expanded={showLogs}
				onClose={logsCallback}
				externalRef={logRef}
				logs={logs}
				size={controlsSize || Sizes.MEDIUM}
				tableColor={tableColor}
			/>
		</div>
	);
};

export default TopRightControls;
