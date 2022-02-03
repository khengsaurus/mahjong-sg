import { Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size, Transition } from 'shared/enums';
import { ControlsTextChi } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './controls.scss';

const BottomLeftControls = (props: BLControlsProps) => {
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
				label={disableChi ? (disablePong ? ControlsTextChi.CHI : pongText) : ControlsTextChi.CHI}
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
			<Fade in={showKai} timeout={Transition.FAST}>
				<div>
					<ControlButton
						label={ControlsTextChi.KAI_EXCLAIM}
						callback={openDeclareHuDialog}
						disabled={disableHu}
						style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
					/>
				</div>
			</Fade>
		</div>
	);
};

export default BottomLeftControls;
