import { IconButton } from '@mui/material';
import 'platform/components/Controls/controls.scss';
import { Size } from 'shared/enums';

interface ControlsButtonProps {
	Icon: React.FC<IHasFontSize>;
	size?: Size;
	onClick: () => void;
}

const IconControlButton = ({ Icon, onClick, size }: ControlsButtonProps) => (
	<IconButton className="icon-button" onClick={onClick} disableRipple>
		<Icon fontSize={size || 'medium'} />
	</IconButton>
);

export default IconControlButton;
