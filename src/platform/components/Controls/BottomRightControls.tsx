import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size } from 'shared/enums';
import { IStore } from 'shared/store';
import './controls.scss';

const BottomRightControls = (props: IBottomRightControls) => {
	const {
		handleThrow,
		handleDraw,
		handleOpen,
		disableThrow,
		disableDraw,
		drawText,
		confirmHu,
		showDeclareHu,
		HHStr
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);

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
			{!confirmHu && !showDeclareHu && HHStr !== '' && (
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
