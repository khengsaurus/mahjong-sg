import { Button } from '@mui/material';
import { getHighlightColor } from 'style/MuiStyles';
import { useSelector } from 'react-redux';
import { IStore } from 'store';

interface IControlButtonP {
	disabled?: boolean;
	label: string;
	style: any;
	callback: () => void;
}

const ControlButton = ({ label, callback, disabled = false, style }: IControlButtonP) => {
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

export default ControlButton;
