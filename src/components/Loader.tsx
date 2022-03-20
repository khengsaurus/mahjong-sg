import { css } from '@emotion/react';
import { Overlay } from 'components';
import { TextColor } from 'enums';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import BarLoader from 'react-spinners/BarLoader';
import { IStore } from 'store';
import { Centered } from 'style/StyledComponents';

interface ILoaderP {
	color?: string;
	css?: any;
	height?: number;
	width?: number;
}

const override = css`
	display: block;
	margin: 0 auto;
`;

export const Loader = (props: ILoaderP) => {
	const {
		theme: { mainTextColor = TextColor.DARK }
	} = useSelector((state: IStore) => state);
	const {
		color = mainTextColor || 'black',
		css = override,
		height = 2,
		width = 80
	} = props;
	return (
		<Centered>
			<BarLoader
				loading={true}
				color={color}
				css={css}
				height={height}
				width={width}
			/>
			<Overlay />
		</Centered>
	);
};

export const NetworkLoader = (props: ILoaderP) => {
	const {
		theme: { mainTextColor = TextColor.DARK }
	} = useSelector((state: IStore) => state);
	const {
		color = mainTextColor || 'black',
		css = override,
		height = 14,
		width = 2
	} = props;
	return (
		<ScaleLoader
			loading={true}
			color={color}
			css={css}
			height={height}
			width={width}
			margin={2}
		/>
	);
};
