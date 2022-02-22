import { IconButton } from '@mui/material';
import 'platform/components/Controls/controls.scss';
import { Size } from 'shared/enums';

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
