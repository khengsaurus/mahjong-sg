import React from 'react';
import { Size } from 'enums';
import getTileSrc from 'images';
import './sampleTile.scss';

interface ISampleTileProps {
	card: string;
	size?: Size;
	className?: string;
	border?: boolean;
	gold?: boolean;
	pink?: boolean;
}

const SampleTile = ({
	card,
	size = Size.SMALL,
	className = '',
	border = false,
	gold = true,
	pink = false
}: ISampleTileProps) => {
	return (
		<div className={className}>
			<img
				src={getTileSrc(card)}
				className={`dummy-tile-${size} ${border ? 'border' : ''} ${pink ? 'pink' : ''} ${gold ? 'gold' : ''}`}
				alt="tile"
				draggable="false"
			/>
		</div>
	);
};

export default React.memo(SampleTile);
