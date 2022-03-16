import { Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import { ControlButton } from 'components/Buttons';
import { MuiStyles } from 'style/MuiStyles';
import { useSelector } from 'react-redux';
import { Size, Transition } from 'enums';
import { ControlsTextChi } from 'screenTexts';
import { IStore } from 'store';
import './controls.scss';

const BottomRightControls = (props: IBRControlsP) => {
	const {
		handleThrow,
		handleDraw,
		handleOpen,
		setShowChiAlert,
		highlight,
		confirmHu,
		disableThrow,
		disableDraw,
		drawText,
		showChiAlert,
		showDeclareHu,
		taken,
		HH
	} = props;
	const {
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((state: IStore) => state);
	const showKai = !confirmHu && !showDeclareHu && !isEmpty(HH);

	return (
		<div
			className={`bottom-right-controls-${controlsSize} ${showKai ? `full` : ``}`}
			style={{ borderColor: highlight || null }}
		>
			<ControlButton
				label={
					drawText === ControlsTextChi.END
						? ControlsTextChi.END
						: taken
						? ControlsTextChi.THROW
						: ControlsTextChi.DRAW
				}
				callback={() => {
					if (!disableDraw || !disableThrow) {
						disableDraw ? handleThrow() : showChiAlert ? setShowChiAlert(false) : handleDraw();
					}
				}}
				disabled={disableDraw && disableThrow}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<Fade in={showKai} timeout={Transition.FAST}>
				<div>
					<ControlButton
						label={ControlsTextChi.KAI_QUESTION}
						callback={handleOpen}
						style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
					/>
				</div>
			</Fade>
		</div>
	);
};

export default BottomRightControls;
