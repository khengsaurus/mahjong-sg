import React from 'react';
import { Sizes } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
import { ControlButton } from '../../global/StyledComponents';
import './controlsLarge.scss';
import './controlsMedium.scss';
import './controlsSmall.scss';

interface BottomRightControlsProps {
	controlsSize: Sizes;
	throwCallback: () => void;
	throwDisabled: boolean;
	drawCallback: () => void;
	drawText: string;
	drawDisabled: boolean;
	openCallback: () => void;
	okToShow: boolean;
	huShowing: boolean;
}

const BottomRightControls = (props: BottomRightControlsProps) => {
	const {
		controlsSize,
		throwCallback,
		throwDisabled,
		drawText,
		drawCallback,
		drawDisabled,
		openCallback,
		okToShow,
		huShowing
	} = props;
	return (
		<div className={`bottom-right-controls-${controlsSize}`}>
			<ControlButton
				label={`丢`}
				callback={throwCallback}
				disabled={throwDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={drawText}
				callback={drawCallback}
				disabled={drawDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{!okToShow && !huShowing && (
				<ControlButton
					label={`开?`}
					callback={openCallback}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			)}
		</div>
	);
};

export default BottomRightControls;
