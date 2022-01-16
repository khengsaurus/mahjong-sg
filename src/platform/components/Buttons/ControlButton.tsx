import { Button } from '@mui/material';

interface ControlButtonProps {
	label: string;
	callback: () => void;
	disabled?: boolean;
	style: any;
}

export const ControlButton = ({ label, callback, disabled = false, style }: ControlButtonProps) => {
	return (
		<Button
			className="button"
			variant="text"
			onClick={callback}
			disabled={disabled}
			style={style}
			color="secondary"
			disableRipple
		>
			{label}
		</Button>
	);
};
