import { Fade } from '@mui/material';
import { ControlButton } from 'platform/components/Buttons/ControlButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size, Transition } from 'shared/enums';
import { GameTextChi } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './controls.scss';

const BottomRightControls = (props: BRControlsProps) => {
	const {
		handleThrow,
		handleDraw,
		handleOpen,
		setShowChiAlert,
		HHStr,
		highlight,
		confirmHu,
		disableThrow,
		disableDraw,
		drawText,
		showDeclareHu,
		taken
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const showKai = !confirmHu && !showDeclareHu && !!HHStr;

	return (
		<div
			className={`bottom-right-controls-${controlsSize} ${showKai ? `full` : ``}`}
			style={{ borderColor: highlight || null }}
		>
			<ControlButton
				label={drawText === GameTextChi.END ? GameTextChi.END : taken ? GameTextChi.THROW : GameTextChi.DRAW}
				callback={() => {
					if (!disableDraw || !disableThrow) {
						setShowChiAlert(false);
						if (!disableDraw) {
							handleDraw();
						} else {
							handleThrow();
						}
					}
				}}
				disabled={disableDraw && disableThrow}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<Fade in={showKai} timeout={Transition.FAST}>
				<div>
					<ControlButton
						label={GameTextChi.KAI_QUESTION}
						callback={handleOpen}
						style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
					/>
				</div>
			</Fade>
		</div>
	);
};

export default BottomRightControls;
