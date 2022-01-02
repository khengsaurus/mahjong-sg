import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import { ILeaveAlert } from 'shared/typesPlus';

const LeaveAlert = ({ show, onClose }: ILeaveAlert) => {
	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.small_dialog
				}
			}}
			onClose={onClose}
		>
			<DialogContent style={{ paddingBottom: 0 }}>
				<Centered>
					<Title variant="subtitle1" title="Are you sure you want to leave?" padding="2px" />
					<Title variant="subtitle2" title="This is a local game and won't be saved" padding="2px" />
				</Centered>
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					padding: '0px 8px',
					minHeight: '14px'
				}}
			>
				<HomeButton />
			</DialogActions>
		</Dialog>
	);
};

export default LeaveAlert;
