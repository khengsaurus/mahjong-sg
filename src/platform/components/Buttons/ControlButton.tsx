import { Button } from '@mui/material';
import { getHighlightColor } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { IStore } from 'shared/store';

interface ControlButtonProps {
	label: string;
	callback: () => void;
	disabled?: boolean;
	style: any;
}

export const ControlButton = ({ label, callback, disabled = false, style }: ControlButtonProps) => {
	const {
		theme: { tableColor }
	} = useSelector((store: IStore) => store);

	return (
		<Button
			className="button"
			variant="text"
			onClick={callback}
			disabled={disabled}
			style={{ ...style, color: disabled ? 'grey' : getHighlightColor(tableColor) }}
			color="secondary"
			disableRipple
		>
			{label}
		</Button>
	);
};
