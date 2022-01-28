import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { StyledButton, StyledCenterText } from 'platform/style/StyledMui';
import React from 'react';

interface ISingleActionProps {
	show: boolean;
	text: string;
	buttonText?: string;
	action?: () => void;
}

const SingleActionModal = ({ show, text, buttonText, action }: ISingleActionProps) => {
	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.small_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: buttonText && action ? 0 : null }}>
				<StyledCenterText text={text} variant="subtitle1" padding="3px 0px" />
			</DialogContent>
			{buttonText && action && (
				<DialogActions
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						padding: '0px 8px',
						minHeight: '14px'
					}}
				>
					<StyledButton label={buttonText} onClick={action} />
				</DialogActions>
			)}
		</Dialog>
	);
};

export default SingleActionModal;