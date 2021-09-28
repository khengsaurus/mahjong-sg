import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { history } from '../App';
import { AppContext } from '../util/hooks/AppContext';
import { Pages, TextColors } from './enums';

export const Styled = (props: any) => {
	const { backgroundColor, tableColor, tileBackColor, tableTextColor, mainTextColor } = useContext(AppContext);
	const colorTheme = {
		backgroundColor,
		tableColor,
		tileBackColor,
		tableTextColor,
		mainTextColor
	};
	return <ThemeProvider theme={colorTheme} {...props} />;
};

export const TableColoredDiv = styled.div`
	background-color: ${props => props.theme.tableColor};
`;

export const Centered = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

export const CenteredColored = styled(Centered)`
	background-color: ${props => props.theme.backgroundColor};
`;

export const Main = styled(Centered)`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.backgroundColor};
`;

export const MainTransparent = styled(Main)`
	background-color: transparent;
`;

export const TableDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100%;
	width: 100%;
	max-height: 900px;
	max-width: 900px;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.tableColor};
`;

export const Wind = styled.div`
	display: flex;
	flex-direction: column;
	font-family: 'Roboto', sans-serif;
	color: ${props => props.theme.backgroundColor};
`;

export const TableText = styled.p`
	color: ${props => props.theme.tableTextColor};
	margin: 0;
`;

export const GreenTableText = styled.p`
	color: ${TextColors.green};
	margin: 0;
`;

export const HiddenTile = styled.div`
	background-color: ${props => props.theme.tileBackColor || 'teal'};
`;

interface TitleProps {
	title: string;
	padding?: string;
	variant?: 'h6' | 'subtitle1';
}

export const Title = ({ title, padding = '15px', variant = 'h6' }: TitleProps) => {
	return (
		<Typography style={{ padding }} variant={variant}>
			{title}
		</Typography>
	);
};

interface StyledButtonProps {
	title: string;
	navigate?: Pages;
	padding?: string;
	onClick?: () => void;
	size?: 'small' | 'medium' | 'large';
	variant?: 'text' | 'outlined' | 'contained';
	disabled?: boolean;
}

export const StyledButton = ({
	title,
	navigate,
	padding = '15px',
	onClick,
	size = 'medium',
	variant = 'text',
	disabled = false
}: StyledButtonProps) => {
	return (
		<Button
			style={{ padding }}
			size={size}
			variant={variant}
			onClick={() => (navigate ? history.push(navigate) : onClick ? onClick() : null)}
			disabled={disabled}
		>
			{title}
		</Button>
	);
};
