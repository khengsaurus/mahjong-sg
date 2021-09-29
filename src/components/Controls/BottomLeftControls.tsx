import React from 'react';
import { Sizes } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
import { ControlButton } from '../../global/StyledComponents';
import './controlsLarge.scss';
import './controlsMedium.scss';
import './controlsSmall.scss';

interface BottomLeftControlsProps {
	controlsSize: Sizes;
	chiCallback: () => void;
	chiDisabled: boolean;
	pongCallback: () => void;
	pongText: string;
	pongDisabled: boolean;
	okToShow: boolean;
	huShowing: boolean;
	huCallback: () => void;
	huDisabled: boolean;
}

const BottomLeftControls = (props: BottomLeftControlsProps) => {
	const {
		controlsSize,
		chiCallback,
		chiDisabled,
		pongText,
		pongCallback,
		pongDisabled,
		okToShow,
		huShowing,
		huCallback,
		huDisabled
	} = props;

	return (
		<div className={`bottom-left-controls-${controlsSize}`}>
			<ControlButton
				label={pongText}
				callback={pongCallback}
				disabled={pongDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={`吃`}
				callback={chiCallback}
				disabled={chiDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{okToShow && !huShowing && (
				<ControlButton
					label="开!"
					callback={huCallback}
					disabled={huDisabled}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			)}
		</div>
	);
};

export default BottomLeftControls;
