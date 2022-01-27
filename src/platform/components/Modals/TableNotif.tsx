import { ImpactStyle } from '@capacitor/haptics';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'shared/store';
import { TableNotifProps } from 'shared/typesPlus';
import { triggerHaptic } from 'shared/util';

const TableNotif = ({ notifs = [], timeout, pong, kang, hu, skip }: TableNotifProps) => {
	const { haptic } = useSelector((store: IStore) => store);

	useEffect(() => {
		if (haptic && !!notifs.find(notif => notif.includes('You can'))) {
			triggerHaptic(ImpactStyle.Heavy);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [haptic, JSON.stringify(notifs)]);

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
					{notifs[0] && <StyledText text={notifs[0]} variant="subtitle1" padding="3px 0px" />}
					<StyledText text={`${timeout}`} variant="subtitle1" padding="0px 0px 6px" />
					{notifs.length > 1 &&
						notifs
							.slice(1, 10)
							.map((n: string, ix: number) => (
								<StyledText key={ix} text={n} variant="subtitle2" padding="0px" />
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
				{skip && (
					<IconButton
						className="icon-button"
						onClick={skip}
						style={{ position: 'absolute', top: -4, right: -4 }}
						disableRipple
					>
						<CloseIcon fontSize={'medium'} />
					</IconButton>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default TableNotif;
