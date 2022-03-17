import { TransitionSpeed } from 'enums';
import { ReactComponent as EdgeDecor1 } from 'images/EdgeDecor1.svg';
import { ReactComponent as EdgeDecor2 } from 'images/EdgeDecor2.svg';
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
		<OverlayBackground>
			<OverlayDecorTopLeft>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorTopLeft>
			<OverlayDecorTopRight>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorTopRight>
			<OverlayDecorBottomLeft>
				<EdgeDecor1 stroke={tableColor} style={style} />
			</OverlayDecorBottomLeft>
			<OverlayDecorBottomRight>
				<EdgeDecor2 stroke={tableColor} style={style} />
			</OverlayDecorBottomRight>
		</OverlayBackground>
	);
};

export default Overlay;
