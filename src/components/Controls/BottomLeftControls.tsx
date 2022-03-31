import { ControlButton, CustomFade } from 'components';
import { Size, Transition } from 'enums';
import isEmpty from 'lodash.isempty';
import { useSelector } from 'react-redux';
import { ControlsTextChi, ControlsTextEng } from 'screenTexts';
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
		sizes: { controlsSize = Size.MEDIUM },
		theme: { enOnly = false }
	} = useSelector((state: IStore) => state);
	const showKai = confirmHu && !showDeclareHu && !disableHu && !isEmpty(HH);
	const chiText = enOnly ? ControlsTextEng.CHI : ControlsTextChi.CHI;
	const showLabel = enOnly ? ControlsTextEng.KAI_EXCLAIM : ControlsTextChi.KAI_EXCLAIM;

	return (
		<div
			className={`bottom-left-controls-${controlsSize} ${showKai ? `full` : ``}`}
			style={{ borderColor: highlight || null }}
		>
			<ControlButton
				label={disablePong ? chiText : pongText}
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
				style={MuiStyles[`buttons_${controlsSize}`]}
			/>
			<CustomFade show={showKai} timeout={Transition.FAST}>
				<ControlButton
					label={showLabel}
					callback={openDeclareHuDialog}
					disabled={disableHu}
					style={MuiStyles[`buttons_${controlsSize}`]}
				/>
			</CustomFade>
		</div>
	);
};

export default BottomLeftControls;
