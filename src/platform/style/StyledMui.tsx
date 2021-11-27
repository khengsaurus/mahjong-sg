import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { history } from 'App';
import { Page } from 'shared/enums';

interface TitleProps {
	title: string;
	color?: string;
	padding?: string;
	variant?: 'h6' | 'subtitle1' | 'subtitle2';
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
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	style?: any;
}

interface ControlButtonProps {
	label: string;
	callback: () => void;
	disabled?: boolean;
	style: any;
}

export const Title = ({ title, color, padding = '10px', variant = 'h6', style = {} }: TitleProps) => {
	return (
		<Typography style={{ color, padding, justifySelf: 'center', alignSelf: 'center', ...style }} variant={variant}>
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

export const ControlButton = ({ label, callback, disabled = false, style }: ControlButtonProps) => {
	return (
		<Button className="button" variant="text" onClick={callback} disabled={disabled} style={style} disableRipple>
			{label}
		</Button>
	);
};

export const HomeButton = () => {
	return <StyledButton label="Home" navigate={Page.INDEX} />;
};
