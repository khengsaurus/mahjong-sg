import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useContext } from 'react';
import { MuiStyles } from '../../global/MuiStyles';
import { Centered, StyledButton, Title } from '../../global/StyledComponents';
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
					{game.hu.length === 3 ? (
						<>
							<Title title={`${game.players[game.hu[0]].username} hu`} padding="5px" />
							<Title
								title={`${game.hu[1]} 台${game.hu[2] === 1 ? ` 自摸` : ``}`}
								variant="subtitle1"
								padding="5px"
							/>
						</>
					) : game.draw ? (
						<>
							<Title title={`Draw!`} padding="5px" />
							<Title title={`15 tiles left`} variant="subtitle1" padding="5px" />
						</>
					) : null}
					{game.ongoing ? (
						playerSeat === Number(game.dealer) && <StyledButton label={`Next round`} onClick={nextRound} />
					) : (
						<Title title={`The game has ended, thank you for playing!`} padding="5px" />
					)}
				</Centered>
			</DialogContent>
		</Dialog>
	);
};

export default Announcement;
