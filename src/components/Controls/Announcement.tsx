import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import { MuiStyles } from '../../global/MuiStyles';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './controlsMedium.scss';

interface Props {
	game: Game;
	playerSeat: number;
}

const Announcement = (props: Props) => {
	const { game, playerSeat } = props;
	const { tableColor, tableTextColor } = useContext(AppContext);

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
					...MuiStyles.dialog,
					backgroundColor: `${tableColor}`
				}
			}}
		>
			<DialogContent>
				{game.hu.length > 1 && (
					<>
						<Typography style={{ color: tableTextColor }} variant="h6">{`${
							game.players[game.hu[0]].username
						} hu`}</Typography>
						<Typography style={{ color: tableTextColor }} variant="subtitle1">{`${game.hu[1]} 台${
							game.hu[2] === 1 ? ` 自摸` : ``
						}`}</Typography>
					</>
				)}
				{game.draw && <Typography style={{ color: tableTextColor }} variant="h6">{`15 tiles left`}</Typography>}
				{game.ongoing ? (
					playerSeat === Number(game.dealer) && (
						<Button
							style={{ color: tableTextColor }}
							variant="text"
							size="small"
							onClick={nextRound}
							autoFocus
						>
							Next round
						</Button>
					)
				) : (
					<Typography
						style={{ color: tableTextColor }}
						variant="h6"
					>{`The game has ended, thank you for playing!`}</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default Announcement;
