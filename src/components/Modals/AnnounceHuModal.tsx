import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useContext } from 'react';
import { MuiStyles } from '../../global/MuiStyles';
import { Centered } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';

interface Props {
	game: Game;
	playerSeat: number;
}

const AnnounceHuModal = (props: Props) => {
	const { game, playerSeat } = props;
	const { tableColor } = useContext(AppContext);

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
				<Centered>
					{game.hu.length === 3 && (
						<>
							<Title title={`${game.players[game.hu[0]].username} hu`} padding="5px" />
							<Title
								title={`${game.hu[1]} 台${game.hu[2] === 1 ? ` 自摸` : ``}`}
								variant="subtitle1"
								padding="2px"
							/>
						</>
					)}
					{game.draw && (
						<>
							<Title title={`Draw!`} padding="5px" />
							<Title title={`15 tiles left`} variant="subtitle1" padding="2px" />
						</>
					)}
					{!game.ongoing && (
						<Title title={`The game has ended, thank you for playing!`} variant="subtitle1" padding="2px" />
					)}
				</Centered>
			</DialogContent>
			<DialogActions>
				{game.ongoing && playerSeat === Number(game.dealer) && (
					<StyledButton label={`Next round`} onClick={nextRound} />
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
