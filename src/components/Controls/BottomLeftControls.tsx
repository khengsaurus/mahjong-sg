import Button from '@material-ui/core/Button';
import React from 'react';
import { Sizes } from '../../global/enums';
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
			<Button className="button" variant="outlined" onClick={chiCallback} disabled={chiDisabled}>
				{`吃`}
			</Button>
			<Button className="button" variant="outlined" onClick={pongCallback} disabled={pongDisabled}>
				{pongText}
			</Button>
			{okToShow && (
				<Button className="button" variant="outlined" size="small" onClick={huCallback} disabled={huDisabled}>
					<p>{`开!`}</p>
				</Button>
			)}
		</div>
	);
};

export default BottomLeftControls;
