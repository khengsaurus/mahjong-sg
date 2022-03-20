import { ControlButton, CustomFade } from 'components';
import { Size, Transition } from 'enums';
import isEmpty from 'lodash.isempty';
import { useSelector } from 'react-redux';
import { ControlsTextChi } from 'screenTexts';
import { IStore } from 'store';
import { MuiStyles } from 'style/MuiStyles';
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
						disableDraw
							? handleThrow()
							: showChiAlert
							? setShowChiAlert(false)
							: handleDraw();
					}
				}}
				disabled={disableDraw && disableThrow}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<CustomFade show={showKai} timeout={Transition.FAST}>
				<ControlButton
					label={ControlsTextChi.KAI_QUESTION}
					callback={handleOpen}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			</CustomFade>
		</div>
	);
};

export default BottomRightControls;
