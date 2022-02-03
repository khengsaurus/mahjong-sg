import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SubjectIcon from '@mui/icons-material/Subject';
import { IconButton } from '@mui/material';
import { LogModal } from 'platform/components/Modals';
import { useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Size, TableColor } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import './controls.scss';

const TopRightControls = (props: TRControlsProps) => {
	const { handlePay, handleLogs, showLogs, showText } = props;
	const {
		theme: { tableColor = TableColor.GREEN },
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const { annHuOpen } = useContext(AppContext);
	const logRef = useRef(null);

	return (
		<div className={`top-right-controls-${controlsSize}`}>
			<IconButton className="icon-button" onClick={handlePay} disableRipple>
				<LeaderboardIcon fontSize={controlsSize} />
			</IconButton>
			<IconButton className="icon-button" onClick={handleLogs} disableRipple ref={logRef}>
				<SubjectIcon fontSize={controlsSize} />
			</IconButton>
			{!annHuOpen && (showText || showLogs) && (
				<LogModal
					expanded={showLogs}
					onClose={handleLogs}
					externalRef={logRef}
					size={controlsSize || Size.MEDIUM}
					tableColor={tableColor}
				/>
			)}
		</div>
	);
};

export default TopRightControls;
