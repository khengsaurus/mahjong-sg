import { IconButton } from '@mui/material';
import 'components/Controls/controls.scss';
import { Size } from 'enums';

interface IIconControlButtonP {
	Icon: React.FC<IHasFontSize>;
	size?: Size;
	onClick: () => void;
}

const IconControlButton = ({ Icon, onClick, size }: IIconControlButtonP) => (
	<IconButton className="icon-button" onClick={onClick} disableRipple>
		<Icon fontSize={size || 'medium'} />
	</IconButton>
);

export default IconControlButton;
