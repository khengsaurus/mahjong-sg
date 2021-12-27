import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { ITableNotif } from 'shared/typesPlus';

const TableNotif = ({ notifs = [], timeout, pong, kang, hu }: ITableNotif) => {
	return (
		<div>
			<Dialog
				open={timeout > 0}
				BackdropProps={{ invisible: true }}
				PaperProps={{
					style: {
						...MuiStyles.small_dialog
					}
				}}
			>
				<DialogContent style={{ paddingBottom: 0 }}>
					<Centered>
						{notifs[0] && <Title title={notifs[0]} variant="subtitle1" padding="3px 0px" />}
						<Title title={`${timeout}`} variant="subtitle1" padding="0px" />
						{notifs[1] && <Title title={notifs[1]} variant="subtitle2" padding="1px 0px" />}
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
					{hu && <StyledButton label={'Hu'} onClick={hu} />}
					{kang && <StyledButton label={'Kang'} onClick={kang} />}
					{pong && <StyledButton label={'Pong'} onClick={pong} />}
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default TableNotif;
