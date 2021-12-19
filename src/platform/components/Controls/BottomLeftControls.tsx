import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useContext } from 'react';
import { AppContext } from 'shared/hooks';
import './controls.scss';

const BottomLeftControls = (props: IBottomLeftControls) => {
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
		HHStr
	} = props;
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`bottom-left-controls-${controlsSize}`}>
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
