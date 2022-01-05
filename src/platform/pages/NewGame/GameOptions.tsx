import { Dialog, DialogContent } from '@mui/material';
import { HomeTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { IModalProps } from 'shared/typesPlus';

const GameOptions = ({ onClose, show, Content }: IModalProps) => {
	// const transform = process.env.REACT_APP_PLATFORM === 'mobile' ? `translateY(-${Offset.HALF_MOBILE})` : null;

	return (
		<HomeTheme>
			<MainTransparent>
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={onClose}
					// style={{ transform }}
				>
					<DialogContent>
						<Content />
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</HomeTheme>
	);
};

export default GameOptions;
