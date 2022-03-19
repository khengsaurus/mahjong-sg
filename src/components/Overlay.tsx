import { TransitionSpeed } from 'enums';
import { ReactComponent as EdgeDecor1 } from 'images/EdgeDecor1.svg';
import { ReactComponent as EdgeDecor2 } from 'images/EdgeDecor2.svg';
import { isAndroid } from 'platform';
import React from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import {
	OverlayBackground,
	OverlayDecorBottomLeft,
	OverlayDecorBottomRight,
	OverlayDecorTopLeft,
	OverlayDecorTopRight
} from 'style/StyledComponents';

const Overlay = () => {
	const {
		theme: { tableColor }
	} = useSelector((store: IStore) => store);
	// dk why transition speed not read in StyledComponents
	const style = { height: 60, width: 60, transition: TransitionSpeed.FAST };

	return (
		<OverlayBackground style={isAndroid ? { top: 10, right: 6, bottom: 10, left: 6 } : null}>
			<OverlayDecorTopLeft style={isAndroid ? { top: 10, left: 6 } : null}>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorTopLeft>
			<OverlayDecorTopRight style={isAndroid ? { top: 10, right: 6 } : null}>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorTopRight>
			<OverlayDecorBottomLeft style={isAndroid ? { bottom: 10, left: 6 } : null}>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorBottomLeft>
			<OverlayDecorBottomRight style={isAndroid ? { bottom: 10, right: 6 } : null}>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorBottomRight>
		</OverlayBackground>
	);
};

export default Overlay;
