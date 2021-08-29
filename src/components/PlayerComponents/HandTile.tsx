import getTileSrc from '../../images';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

interface HandTileProps {
	tile: TileI;
	selected: boolean;
	last: boolean;
	callback: () => void;
}

export const HandTile = (props: HandTileProps) => {
	const { tile, selected, last, callback } = props;
	return (
		<div
			key={tile.id}
			className={`self-hidden-tile${selected ? ` selected` : ` unselected`}${last ? ` last` : ``}`}
			onClick={callback}
		>
			<img className="self-hidden-tile-bg" src={getTileSrc(tile.card)} alt="tile" />
		</div>
	);
};
