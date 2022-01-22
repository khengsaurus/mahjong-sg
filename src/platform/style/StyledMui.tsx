import { Button, Typography } from '@mui/material';
import { history } from 'App';
import { Page } from 'shared/enums';

interface StyledTextProps {
	text: string;
	color?: string;
	padding?: string;
	variant?: 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
	textAlign?: 'left' | 'center' | 'right';
	placeSelf?: 'left' | 'center' | 'right';
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
	text,
	color,
	variant = 'h6',
	padding = variant.startsWith('body') ? '0px' : '5px 0px',
	textAlign = 'left',
	placeSelf = 'center',
	style = {}
}: StyledTextProps) => (
	<Typography
		style={{ justifySelf: 'center', alignSelf: 'center', color, padding, textAlign, placeSelf, ...style }}
		variant={variant}
	>
		{text}
	</Typography>
);

export const StyledCenterText = ({ text, padding, variant = 'body2' }: StyledTextProps) => (
	<Typography
		style={{
			justifySelf: 'center',
			alignSelf: 'center',
			textAlign: 'center',
			placeSelf: 'center',
			padding: padding || variant === 'h6' ? '5px 0px' : '0px'
		}}
		variant={variant}
	>
		{text}
	</Typography>
);

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
