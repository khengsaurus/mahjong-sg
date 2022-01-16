import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size } from 'shared/enums';
import { IStore } from 'shared/store';
import './controls.scss';

const BottomLeftControls = (props: BLControlsProps) => {
	const {
		handleChi,
		handlePong,
		openDeclareHuDialog,
		disableChi,
		disablePong,
		disableHu,
		pongText,
		confirmHu,
		showDeclareHu,
		HHStr,
		highlight
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);

	return (
		<div className={`bottom-left-controls-${controlsSize}`} style={{ borderColor: highlight || null }}>
			<ControlButton
				label={pongText}
				callback={handlePong}
				disabled={disablePong}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={`吃`}
				callback={handleChi}
				disabled={disableChi}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{confirmHu && !showDeclareHu && HHStr !== '' && (
				<ControlButton
					label="开!"
					callback={openDeclareHuDialog}
					disabled={disableHu}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			)}
		</div>
	);
};

export default BottomLeftControls;
