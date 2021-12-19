import Button from '@material-ui/core/Button';

interface ControlButtonProps {
	label: string;
	callback: () => void;
	disabled?: boolean;
	style: any;
}

export const ControlButton = ({ label, callback, disabled = false, style }: ControlButtonProps) => {
	return (
		<Button className="button" variant="text" onClick={callback} disabled={disabled} style={style} disableRipple>
			{label}
		</Button>
	);
};
