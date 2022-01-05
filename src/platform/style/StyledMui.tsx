import { Button, Typography } from '@mui/material';
import { history } from 'App';
import { Page } from 'shared/enums';

interface StyledTextProps {
	title: string;
	color?: string;
	padding?: string;
	variant?: 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
	textAlign?: 'left' | 'center' | 'right';
	style?: any;
}

interface StyledButtonProps {
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
}

export const StyledText = ({
	title,
	color,
	variant = 'h6',
	padding = variant.startsWith('body') ? '0px' : '10px',
	textAlign = 'left',
	style = {}
}: StyledTextProps) => {
	return (
		<Typography
			style={{ color, padding, justifySelf: 'center', alignSelf: 'center', textAlign, ...style }}
			variant={variant}
		>
			{title}
		</Typography>
	);
};

export const StyledButton = ({
	label,
	navigate,
	color,
	padding = '10px',
	size = 'medium',
	variant = 'text',
	autoFocus = false,
	onClick,
	type,
	disabled = false,
	style = {}
}: StyledButtonProps) => {
	return (
		<Button
			style={{ color, padding, ...style }}
			size={size}
			variant={variant}
			autoFocus={autoFocus}
			onClick={() => (navigate ? history.push(navigate) : onClick ? onClick() : null)}
			type={type}
			disabled={disabled}
			disableRipple
		>
			{label}
		</Button>
	);
};
