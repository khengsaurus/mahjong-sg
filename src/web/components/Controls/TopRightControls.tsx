import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SubjectIcon from '@material-ui/icons/Subject';
import React, { useContext, useRef } from 'react';
import { Sizes } from 'shared/enums';
import { AppContext } from 'shared/util/hooks/AppContext';
import LogModal from '../Modals/LogModal';
import './controls.scss';

const TopRightControls = (props: ITopRightControls) => {
	const { handlePay, handleLogs, showLogs, logs } = props;
	const { controlsSize, tableColor } = useContext(AppContext);
	const logRef = useRef(null);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<IconButton className="icon-button" onClick={handlePay} disableRipple>
				<MonetizationOnIcon fontSize={controlsSize} />
			</IconButton>
			<IconButton className="icon-button" onClick={handleLogs} disableRipple ref={logRef}>
				<SubjectIcon fontSize={controlsSize} />
			</IconButton>
			<LogModal
				expanded={showLogs}
				onClose={handleLogs}
				externalRef={logRef}
				logs={logs}
				size={controlsSize || Sizes.MEDIUM}
				tableColor={tableColor}
			/>
		</div>
	);
};

export default TopRightControls;
