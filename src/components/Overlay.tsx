import { TransitionSpeed } from 'enums';
import { ReactComponent as EdgeDecor1 } from 'images/EdgeDecor1.svg';
import { ReactComponent as EdgeDecor2 } from 'images/EdgeDecor2.svg';
import { isAndroid } from 'platform';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import {
	OverlayBackground,
	OverlayDecorBottomLeft,
	OverlayDecorBottomRight,
	OverlayDecorTopLeft,
	OverlayDecorTopRight
} from 'style/StyledComponents';

const xM = isAndroid ? '10px' : '6px';
export const yM = isAndroid ? '25px' : '10px'; // additional 6px Y margin for anrdoid

const Overlay = () => {
	const {
		theme: { tableColor }
	} = useSelector((store: IStore) => store);
	// dk why transition speed not read in StyledComponents
	const style = { height: 60, width: 60, transition: TransitionSpeed.FAST };

	return (
		<OverlayBackground
			id="overlay-background"
			style={isAndroid ? { top: yM, right: xM, bottom: yM, left: xM } : null}
		>
			<OverlayDecorTopLeft style={isAndroid ? { top: yM, left: xM } : null}>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorTopLeft>
			<OverlayDecorTopRight style={isAndroid ? { top: yM, right: xM } : null}>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorTopRight>
			<OverlayDecorBottomLeft style={isAndroid ? { bottom: yM, left: xM } : null}>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorBottomLeft>
			<OverlayDecorBottomRight style={isAndroid ? { bottom: yM, right: xM } : null}>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorBottomRight>
		</OverlayBackground>
	);
};

export default Overlay;
