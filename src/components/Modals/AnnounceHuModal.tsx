import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { isEmpty } from 'lodash';
import React from 'react';
import { MuiStyles } from '../../global/MuiStyles';
import { HomeButton, StyledButton, Title } from '../../global/StyledMui';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import PaymentModalInline from './PaymentModalInline';

interface Props {
	game: Game;
	playerSeat: number;
	showing: boolean;
	showCallback: () => void;
}

const AnnounceHuModal = (props: Props) => {
	const { game, playerSeat, showing, showCallback } = props;
	const { hu, draw, ongoing, dealer } = game;

	async function nextRound() {
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<Dialog
			open={!isEmpty(hu)}
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
						<Title title={`${game.players[hu[0]]?.username} hu`} padding="2px" />
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
				{/* {!ongoing ||
					(dealer === 10 && <Title title={`The game has ended!`} variant="subtitle1" padding="2px" />)} */}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center'
				}}
			>
				<HomeButton />
				{hu.length === 3 && hu[0] !== playerSeat && (
					<StyledButton label={showing ? 'Close' : 'Open'} onClick={showCallback} />
				)}
				{ongoing && playerSeat === Number(game.dealer) && (
					<StyledButton label={`Next Round`} onClick={nextRound} />
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
