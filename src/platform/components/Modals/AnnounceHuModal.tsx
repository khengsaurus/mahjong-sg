import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { isEmpty } from 'lodash';
import { MuiStyles } from 'platform/style/MuiStyles';
import { HomeButton, StyledButton, Title } from 'platform/style/StyledMui';
import React from 'react';
import FBService from 'platform/service/MyFirebaseService';
import PaymentModalInline from './PaymentModalInline';

const AnnounceHuModal = ({ game, playerSeat, show, onClose }: IModalProps) => {
	const { hu, draw, on, dealer } = game;

	async function nextRound() {
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<Dialog
			open={!isEmpty(hu) || draw}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.announce_hu_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{hu.length === 3 && (
					<>
						<Title title={`${game.ps[hu[0]]?.uN} hu`} padding="2px" />
						<Title title={`${hu[1]} 台${hu[2] === 1 ? ` 自摸` : ``}`} variant="subtitle1" padding="2px" />
					</>
				)}
				{hu.length === 3 && hu[0] !== playerSeat && <PaymentModalInline game={game} playerSeat={playerSeat} />}
				{draw && (
					<>
						<Title title={`Draw!`} padding="2px" />
						<Title title={`15 tiles left`} variant="subtitle1" padding="2px" />
					</>
				)}
				{!on || (dealer === 10 && <Title title={`The game has ended!`} variant="subtitle1" padding="2px" />)}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					paddingTop: '0px'
				}}
			>
				<HomeButton />
				{hu.length === 3 && hu[0] !== playerSeat && (
					<StyledButton label={show ? 'Hide' : 'Show'} onClick={onClose} />
				)}
				{on && playerSeat === Number(game.dealer) && <StyledButton label={`Next Round`} onClick={nextRound} />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
