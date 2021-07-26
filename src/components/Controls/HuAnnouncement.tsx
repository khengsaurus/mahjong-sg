import { Button, Dialog, DialogContent, ThemeProvider, Typography } from '@material-ui/core';
import React from 'react';
import { Game } from '../../Models/Game';
import FBService from '../../service/FirebaseService';
import { rotatedMUIDialog } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	game: Game;
	playerSeat: number;
}

const HuAnnouncement = (props: Props) => {
	const { game, playerSeat } = props;

	async function nextRound() {
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<div className="main transparent">
			<ThemeProvider theme={rotatedMUIDialog}>
				<Dialog
					open={game.hu !== []}
					BackdropProps={{ invisible: true }}
					PaperProps={{
						style: {
							backgroundColor: 'rgb(220, 190, 150)'
						}
					}}
				>
					{game.hu.length > 1 && (
						<DialogContent>
							<Typography variant="h6">{`${game.players[game.hu[0]].username} hu`}</Typography>
							<Typography variant="subtitle1">{`${game.hu[1]} 台${
								game.hu[2] === 1 ? ` 自摸` : ``
							}`}</Typography>
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
					)}
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default HuAnnouncement;
