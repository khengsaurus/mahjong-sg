import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { HomeButton } from 'components';
import { MuiStyles } from 'style/MuiStyles';
import { Centered } from 'style/StyledComponents';
import { StyledText } from 'style/StyledMui';
import { ILeaveAlertP } from 'typesPlus';

const LeaveAlert = ({ show, onClose }: ILeaveAlertP) => {
	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: MuiStyles.small_dialog
			}}
			onClose={onClose}
		>
			<DialogContent>
				<Centered>
					<StyledText
						variant="subtitle1"
						text="Are you sure you want to leave?"
						padding="2px"
					/>
					<StyledText
						variant="subtitle2"
						text="This is a local game and won't be saved"
						padding="2px"
					/>
				</Centered>
			</DialogContent>
			<DialogActions style={MuiStyles.single_action}>
				<HomeButton />
			</DialogActions>
		</Dialog>
	);
};

export default LeaveAlert;
