import Button from '@material-ui/core/Button';
import React from 'react';
import { Sizes } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';

interface BottomLeftControlsProps {
	controlsSize: Sizes;
	chiCallback: () => void;
	chiDisabled: boolean;
	pongCallback: () => void;
	pongText: string;
	pongDisabled: boolean;
	okToShow: boolean;
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
		huCallback,
		huDisabled
	} = props;

	return (
		<div className={`bottom-left-controls-${controlsSize}`}>
			<Button
				className="button"
				variant="text"
				onClick={chiCallback}
				disabled={chiDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			>
				{`吃`}
			</Button>
			<Button
				className="button"
				variant="text"
				onClick={pongCallback}
				disabled={pongDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			>
				{pongText}
			</Button>
			{okToShow && (
				<Button
					className="button"
					variant="text"
					onClick={huCallback}
					disabled={huDisabled}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				>
					<p>{`开!`}</p>
				</Button>
			)}
		</div>
	);
};

export default BottomLeftControls;
