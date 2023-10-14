import { ControlButton, CustomFade } from 'components';
import { Size, Transition } from 'enums';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ControlsTextChi, ControlsTextEng } from 'screenTexts';
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
		sizes: { controlsSize = Size.MEDIUM },
		theme: { enOnly = false }
	} = useSelector((state: IStore) => state);
	const showKai = !confirmHu && !showDeclareHu && !isEmpty(HH);

	const controlLabel = useMemo(() => {
		return drawText === ControlsTextChi.END || drawText === ControlsTextEng.END
			? drawText
			: taken
			? enOnly
				? ControlsTextEng.THROW
				: ControlsTextChi.THROW
			: enOnly
			? ControlsTextEng.DRAW
			: ControlsTextChi.DRAW;
	}, [drawText, enOnly, taken]);

	const showLabel = useMemo(() => {
		return enOnly ? ControlsTextEng.KAI_QUESTION : ControlsTextChi.KAI_QUESTION;
	}, [enOnly]);

	return (
		<div
			className={`bottom-right-controls-${controlsSize} ${showKai ? `full` : ``}`}
			style={{ borderColor: highlight || null }}
		>
			<ControlButton
				label={controlLabel}
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
				style={MuiStyles[`buttons_${controlsSize}`]}
			/>
			<CustomFade show={showKai} timeout={Transition.FAST}>
				<ControlButton
					label={showLabel}
					callback={handleOpen}
					style={MuiStyles[`buttons_${controlsSize}`]}
				/>
			</CustomFade>
		</div>
	);
};

export default BottomRightControls;
