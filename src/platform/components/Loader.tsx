import { css } from '@emotion/react';
import { Centered } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import BarLoader from 'react-spinners/BarLoader';
import { TextColor } from 'shared/enums';
import { IStore } from 'shared/store';

interface LoaderProps {
	color?: string;
	css?: any;
	height?: number;
	width?: number;
}

const override = css`
	display: block;
	margin: 0 auto;
`;

export const Loader = (props: LoaderProps) => {
	const {
		theme: { mainTextColor = TextColor.DARK }
	} = useSelector((state: IStore) => state);
	const { color = mainTextColor || 'white', css = override, height = 2, width = 80 } = props;
	return (
		<Centered>
			<BarLoader loading={true} color={color} css={css} height={height} width={width} />
		</Centered>
	);
};
