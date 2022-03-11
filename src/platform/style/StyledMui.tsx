import { Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { Page } from 'shared/enums';
import { AppContext } from 'shared/hooks';

interface IStyledTextP {
	text: string;
	color?: string;
	padding?: string;
	variant?: 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
	textAlign?: 'left' | 'center' | 'right';
	placeSelf?: 'left' | 'center' | 'right';
	style?: any;
}

interface IStyledButtonProps {
	label: string;
	navigate?: Page;
	color?: string;
	padding?: string;
	size?: 'small' | 'medium' | 'large';
	variant?: 'text' | 'outlined' | 'contained';
	autoFocus?: boolean;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	style?: any;
	onClick?: () => void;
	showOnHover?: string[];
}

export const StyledText = ({
	text,
	color,
	variant = 'h6',
	padding = variant.startsWith('body') ? '0px' : '5px 0px',
	textAlign = 'left',
	placeSelf = 'center',
	style = {}
}: IStyledTextP) => (
	<Typography
		style={{ justifySelf: 'center', alignSelf: 'center', color, padding, textAlign, placeSelf, ...style }}
		variant={variant}
	>
		{text}
	</Typography>
);

export const StyledCenterText = ({ text, padding, style, variant = 'body2' }: IStyledTextP) => (
	<Typography
		style={{
			justifySelf: 'center',
			alignSelf: 'center',
			textAlign: 'center',
			placeSelf: 'center',
			padding: padding ? padding : variant === 'h6' ? '5px 0px' : '0px',
			...style
		}}
		variant={variant}
	>
		{text}
	</Typography>
);

export const StyledButton = ({
	color,
	label,
	onClick,
	navigate,
	type,
	padding = '10px',
	size = 'medium',
	variant = 'text',
	autoFocus = false,
	disabled = false,
	style = {}
}: IStyledButtonProps) => {
	const { navigate: _navigate } = useContext(AppContext);
	return (
		<Button
			style={{ color, padding, ...style }}
			size={size}
			variant={variant}
			autoFocus={autoFocus}
			onClick={() => (navigate ? _navigate(navigate) : onClick ? onClick() : null)}
			type={type}
			disabled={disabled}
			disableRipple
		>
			{label}
		</Button>
	);
};
