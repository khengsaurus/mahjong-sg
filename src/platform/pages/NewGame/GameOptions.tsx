import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { Offset } from 'shared/enums';
import { IModalProps } from 'shared/typesPlus';

const GameOptions = ({ onClose, show, Content }: IModalProps) => {
	const transform = process.env.REACT_APP_PLATFORM === 'mobile' ? `translateY(-${Offset.HALF_MOBILE})` : null;

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose} style={{ transform }}>
					<DialogContent>
						<Content />
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default GameOptions;
