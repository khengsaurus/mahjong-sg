import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { getHighlightColor } from 'style/MuiStyles';

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
			style={{
				...style,
				color: disabled ? 'grey' : getHighlightColor(tableColor),
				textTransform: 'capitalize'
			}}
			color="secondary"
			disableRipple
		>
			{label}
		</Button>
	);
};

export default ControlButton;
