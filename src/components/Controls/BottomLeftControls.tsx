import { ControlButton, CustomFade } from 'components';
import { Size, Transition } from 'enums';
import isEmpty from 'lodash.isempty';
import { useSelector } from 'react-redux';
import { ControlsTextChi } from 'screenTexts';
import { IStore } from 'store';
import { MuiStyles } from 'style/MuiStyles';
import './controls.scss';

const BottomLeftControls = (props: IBLControlsP) => {
	const {
		handleChi,
		handlePong,
		openDeclareHuDialog,
		setShowChiAlert,
		disableChi,
		disablePong,
		disableHu,
		pongText,
		confirmHu,
		showDeclareHu,
		highlight,
		HH
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const showKai = confirmHu && !showDeclareHu && !disableHu && !isEmpty(HH);

	return (
		<div
			className={`bottom-left-controls-${controlsSize} ${showKai ? `full` : ``}`}
			style={{ borderColor: highlight || null }}
		>
			<ControlButton
				label={
					disableChi
						? disablePong
							? ControlsTextChi.CHI
							: pongText
						: ControlsTextChi.CHI
				}
				callback={() => {
					if (!disableChi || !disablePong) {
						setShowChiAlert(false);
						if (!disableChi) {
							handleChi();
						} else {
							handlePong();
						}
					}
				}}
				disabled={disableChi && disablePong}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<CustomFade show={showKai} timeout={Transition.FAST}>
				<ControlButton
					label={ControlsTextChi.KAI_EXCLAIM}
					callback={openDeclareHuDialog}
					disabled={disableHu}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			</CustomFade>
		</div>
	);
};

export default BottomLeftControls;
