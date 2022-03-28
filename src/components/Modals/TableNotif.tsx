import { ImpactStyle } from '@capacitor/haptics';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { triggerHaptic } from 'platform';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { MuiStyles } from 'style/MuiStyles';
import { Centered } from 'style/StyledComponents';
import { StyledButton, StyledText } from 'style/StyledMui';
import { ITableNotifP } from 'typesPlus';

const TableNotif = ({ notifs = [], timeout, pong, kang, hu, skip }: ITableNotifP) => {
	const { haptic } = useSelector((store: IStore) => store);
	const hasMoreThanOneAction = (!!pong ? 1 : 0) + (!!kang ? 1 : 0) + (!!hu ? 1 : 0) > 1;

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
			PaperProps={{ style: MuiStyles.small_dialog }}
		>
			<DialogContent>
				<Centered>
					{notifs[0] && (
						<StyledText
							text={notifs[0]}
							variant="subtitle1"
							padding="3px 0px"
						/>
					)}
					<StyledText text={`${timeout}`} variant="subtitle1" padding="0px" />
					{notifs.length > 1 &&
						notifs
							.slice(1, 10)
							.map((n: string, ix: number) => (
								<StyledText
									key={ix}
									text={n}
									variant="subtitle2"
									padding="0px"
								/>
							))}
				</Centered>
			</DialogContent>
			<DialogActions style={hasMoreThanOneAction ? {} : MuiStyles.single_action}>
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
