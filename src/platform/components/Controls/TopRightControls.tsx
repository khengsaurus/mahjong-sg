import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SubjectIcon from '@material-ui/icons/Subject';
import LogModal from 'platform/components/Modals/LogModal';
import { useContext, useRef } from 'react';
import { Size } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import './controls.scss';

const TopRightControls = (props: ITopRightControls) => {
	const { handlePay, handleLogs, showLogs, logs, showText } = props;
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
			{showText && (
				<LogModal
					expanded={showLogs}
					onClose={handleLogs}
					externalRef={logRef}
					logs={logs}
					size={controlsSize || Size.MEDIUM}
					tableColor={tableColor}
				/>
			)}
		</div>
	);
};

export default TopRightControls;
