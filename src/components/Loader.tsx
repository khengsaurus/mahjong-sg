import { css } from '@emotion/react';
import { useContext } from 'react';
import BarLoader from 'react-spinners/BarLoader';
import { Centered } from '../global/StyledComponents';
import { AppContext } from '../util/hooks/AppContext';

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
	const { mainTextColor } = useContext(AppContext);
	const { color = mainTextColor || 'white', css = override, height = 2, width = 80 } = props;
	return (
		<Centered>
			<BarLoader loading={true} color={color} css={css} height={height} width={width} />
		</Centered>
	);
};
