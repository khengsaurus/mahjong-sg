import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size } from 'shared/enums';
import { IStore } from 'shared/store';
import './controls.scss';

const BottomRightControls = (props: BRControlsProps) => {
	const {
		handleThrow,
		handleDraw,
		handleOpen,
		setShowChiAlert,
		showChiAlert,
		disableThrow,
		disableDraw,
		drawText,
		confirmHu,
		showDeclareHu,
		HHStr,
		highlight
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);

	return (
		<div className={`bottom-right-controls-${controlsSize}`} style={{ borderColor: highlight || null }}>
			<ControlButton
				label={`丢`}
				callback={handleThrow}
				disabled={disableThrow}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={drawText}
				callback={() => (showChiAlert ? setShowChiAlert(false) : handleDraw())}
				disabled={disableDraw}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{!confirmHu && !showDeclareHu && HHStr && (
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
