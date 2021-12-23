import { IconButton } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SubjectIcon from '@mui/icons-material/Subject';
import isEmpty from 'lodash.isempty';
import LogModal from 'platform/components/Modals/LogModal';
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Size } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import './controls.scss';

const TopRightControls = (props: ITopRightControls) => {
	const { handlePay, handleLogs, showLogs, showText } = props;
	const { currGame } = useContext(AppContext);
	const { theme, sizes } = useSelector((state: IStore) => state);
	const { tableColor } = theme;
	const { controlsSize } = sizes;
	const logRef = useRef(null);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<IconButton className="icon-button" onClick={handlePay} disableRipple>
				<MonetizationOnIcon fontSize={controlsSize} />
			</IconButton>
			{showText && (
				<IconButton className="icon-button" onClick={handleLogs} disableRipple ref={logRef}>
					<SubjectIcon fontSize={controlsSize} />
				</IconButton>
			)}
			{showText && !isEmpty(currGame?.logs) && (
				<LogModal
					expanded={showLogs}
					onClose={handleLogs}
					externalRef={logRef}
					logs={currGame.logs}
					size={controlsSize || Size.MEDIUM}
					tableColor={tableColor}
				/>
			)}
		</div>
	);
};

export default TopRightControls;
