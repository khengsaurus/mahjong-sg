import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SubjectIcon from '@mui/icons-material/Subject';
import { IconButton } from '@mui/material';
import { LogModal } from 'components';
import { Size } from 'enums';
import { AppContext } from 'hooks';
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import './controls.scss';

const TopRightControls = (props: ITRControlsP) => {
	const { handlePay, handleLogs, showLogs, showText } = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const { annHuOpen } = useContext(AppContext);
	const logRef = useRef(null);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<IconButton className="icon-button" onClick={handlePay} disableRipple>
				<MonetizationOnIcon fontSize={controlsSize} />
			</IconButton>
			<IconButton
				className="icon-button"
				onClick={handleLogs}
				disableRipple
				ref={logRef}
			>
				<SubjectIcon fontSize={controlsSize} />
			</IconButton>
			{!annHuOpen && (showText || showLogs) && (
				<LogModal expanded={showLogs} onClose={handleLogs} externalRef={logRef} />
			)}
		</div>
	);
};

export default TopRightControls;
