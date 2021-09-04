import Button from '@material-ui/core/Button';
import React from 'react';
import { Sizes } from '../../global/enums';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';

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
			<Button className="button" variant="outlined" size="small" onClick={throwCallback} disabled={throwDisabled}>
				{`丢`}
			</Button>
			<Button className="button" variant="outlined" onClick={drawCallback} disabled={drawDisabled}>
				{drawText}
			</Button>
			{!okToShow && (
				<Button
					className="button"
					variant="outlined"
					onClick={openCallback}
					// onClick={e => {
					// 	e.preventDefault();
					// 	game.newLog(`Test: ${Math.random()}`);
					// 	FBService.updateGame(game);
					// }}
				>
					{`开?`}
				</Button>
			)}
		</div>
	);
};

export default BottomRightControls;
