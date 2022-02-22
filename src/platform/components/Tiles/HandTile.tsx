import React from 'react';
import getTileSrc from 'shared/images';

interface IHandTileP {
	card: string;
	selected: boolean;
	last: boolean;
	callback: () => void;
}

const HandTile: React.FC<IHandTileP> = (props: IHandTileP) => {
	const { card, selected, last, callback } = props;
	return (
		<div
			className={`self-hidden-tile${selected ? ` selected` : ` unselected`}${last ? ` last` : ``}`}
			onClick={callback}
		>
			<img className="self-hidden-tile-bg" src={getTileSrc(card)} alt="tile" draggable="false" />
		</div>
	);
};

export default HandTile;
