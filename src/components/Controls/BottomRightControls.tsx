import React, { useContext } from 'react';
import { MuiStyles } from '../../global/MuiStyles';
import { ControlButton } from '../../global/StyledMui';
import { AppContext } from '../../util/hooks/AppContext';
import './controls.scss';

const BottomRightControls = (props: IBottomRightControls) => {
	const { handleThrow, disableThrow, drawText, handleDraw, disableDraw, handleOpen, confirmHu, showHu } = props;
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`bottom-right-controls-${controlsSize}`}>
			<ControlButton
				label={`丢`}
				callback={handleThrow}
				disabled={disableThrow}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={drawText}
				callback={handleDraw}
				disabled={disableDraw}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{!confirmHu && !showHu && (
				<ControlButton
					label={`开?`}
					callback={handleOpen}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			)}
		</div>
	);
};

export default BottomRightControls;
