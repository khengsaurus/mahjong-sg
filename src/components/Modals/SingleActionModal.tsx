import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { MuiStyles } from 'style/MuiStyles';
import { StyledButton, StyledCenterText } from 'style/StyledMui';

interface ISingleActionP {
	show: boolean;
	text: string;
	buttonText?: string;
	action?: () => void;
}

const SingleActionModal = ({ show, text, buttonText, action }: ISingleActionP) => {
	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: MuiStyles.small_dialog
			}}
		>
			<DialogContent style={{ paddingBottom: buttonText && action ? 0 : '10px' }}>
				<StyledCenterText text={text} variant="subtitle1" padding="3px 0px" />
			</DialogContent>
			{buttonText && action && (
				<DialogActions style={MuiStyles.single_action}>
					<StyledButton label={buttonText} onClick={action} />
				</DialogActions>
			)}
		</Dialog>
	);
};

export default SingleActionModal;
