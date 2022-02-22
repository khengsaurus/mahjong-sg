import { Button } from '@mui/material';
import { getHighlightColor } from 'platform/style/MuiStyles';
import { useSelector } from 'react-redux';
import { IStore } from 'shared/store';

interface IControlButtonP {
	disabled?: boolean;
	label: string;
	style: any;
	callback: () => void;
}

export const ControlButton = ({ label, callback, disabled = false, style }: IControlButtonP) => {
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
