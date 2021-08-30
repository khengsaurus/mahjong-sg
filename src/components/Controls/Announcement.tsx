import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import './ControlsMedium.scss';

interface Props {
	game: Game;
	playerSeat: number;
	bgColor: string;
}

const Announcement = (props: Props) => {
	const { game, playerSeat, bgColor } = props;

	async function nextRound() {
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<Dialog
			open={game.hu !== []}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					minHeight: '120px',
					justifyContent: 'center',
					backgroundColor: `${bgColor}`
				}
			}}
		>
			<DialogContent>
				{game.hu.length > 1 && (
					<>
						<Typography variant="h6">{`${game.players[game.hu[0]].username} hu`}</Typography>
						<Typography variant="subtitle1">{`${game.hu[1]} 台${
							game.hu[2] === 1 ? ` 自摸` : ``
						}`}</Typography>
					</>
				)}
				{game.draw && <Typography variant="h6">{`15 tiles left`}</Typography>}
				{game.ongoing ? (
					playerSeat === Number(game.dealer) && (
						<Button variant="outlined" size="small" onClick={nextRound} autoFocus>
							Next round
						</Button>
					)
				) : (
					<Typography variant="h6">{`The game has ended, thank you for playing!`}</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default Announcement;
