import Button from '@material-ui/core/Button';
import React from 'react';
import { Sizes } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
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
}

const BottomRightControls = (props: BottomRightControlsProps) => {
	const { controlsSize, throwCallback, throwDisabled, drawText, drawCallback, drawDisabled, okToShow, openCallback } =
		props;
	return (
		<div className={`bottom-right-controls-${controlsSize}`}>
			<Button
				className="button"
				variant="text"
				onClick={throwCallback}
				disabled={throwDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			>
				{`丢`}
			</Button>
			<Button
				className="button"
				variant="text"
				onClick={drawCallback}
				disabled={drawDisabled}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			>
				{drawText}
			</Button>
			{!okToShow && (
				<Button
					className="button"
					variant="text"
					onClick={openCallback}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				>
					{`开?`}
				</Button>
			)}
		</div>
	);
};

export default BottomRightControls;
