import getTileSrc from '../../images';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

interface HandTileProps {
	card: string;
	selected: boolean;
	last: boolean;
	callback: () => void;
}

export const HandTile = (props: HandTileProps) => {
	const { card, selected, last, callback } = props;
	return (
		<div
			className={`self-hidden-tile${selected ? ` selected` : ` unselected`}${last ? ` last` : ``}`}
			onClick={callback}
		>
			<img className="self-hidden-tile-bg" src={getTileSrc(card)} alt="tile" />
		</div>
	);
};
