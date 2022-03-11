import React from 'react';
import { Size } from 'shared/enums';
import getTileSrc from 'shared/images';
import './sampleTile.scss';

interface ISampleTileProps {
	card: string;
	size?: Size;
	border?: boolean;
	gold?: boolean;
	pink?: boolean;
}

const SampleTile = ({ card, size = Size.SMALL, border = false, gold = true, pink = false }: ISampleTileProps) => {
	return (
		<img
			src={getTileSrc(card)}
			className={`dummy-tile-${size} ${border ? 'border' : ''} ${pink ? 'pink' : ''} ${gold ? 'gold' : ''}`}
			alt="tile"
			draggable="false"
		/>
	);
};

export default SampleTile;
