import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { ITableNotif } from 'shared/typesPlus';

const TableNotif = ({ notifs = [], timeout, pong, kang, hu }: ITableNotif) => {
	return (
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
					{notifs[0] && <StyledText title={notifs[0]} variant="subtitle1" padding="3px 0px" />}
					<StyledText title={`${timeout}`} variant="subtitle1" padding="0px 0px 6px" />
					{notifs.length > 1 &&
						notifs
							.slice(1, 10)
							.map((n: string, ix: number) => (
								<StyledText key={ix} title={n} variant="subtitle2" padding="0px" />
							))}
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
				{pong && <StyledButton label={'Pong'} onClick={pong} />}
				{kang && <StyledButton label={'Kang'} onClick={kang} />}
				{hu && <StyledButton label={'Hu'} onClick={hu} />}
			</DialogActions>
		</Dialog>
	);
};

export default TableNotif;
