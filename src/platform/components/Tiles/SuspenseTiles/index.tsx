import React from 'react';
import { Segment } from 'shared/enums';
import './suspenseTiles.scss';

interface SuspenseBlockProps {
	color?: string;
	height?: number;
	width?: number;
	segment?: Segment;
}

const SuspenseTiles = ({ height, width, color, segment }: SuspenseBlockProps) => {
	const horizontal = segment === Segment.TOP || segment === Segment.BOTTOM;
	const background = `linear-gradient(${horizontal ? `-90deg,` : ``}gainsboro, ${color}, ${color}, gainsboro)`;

	return (
		<div
			className={`suspense-tiles-${horizontal ? 'horizontal' : 'vertical'}`}
			style={{ height, width, background }}
		/>
	);
};

export default SuspenseTiles;
