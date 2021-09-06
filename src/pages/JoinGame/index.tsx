import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import firebase from 'firebase/app';
import { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Centered, Main } from '../../global/StyledComponents';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { formatDateToDay, objToGame } from '../../util/utilFns';
import Login from '../Login';
import './JoinGame.scss';

const JoinGame = () => {
	const { user, setGameId, handleUserState } = useContext(AppContext);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let games: Game[] = [];
		const unsubscribe = FBService.listenInvitesSnapshot(user, {
			next: (snapshot: any) => {
				snapshot.docs.forEach(function (doc: firebase.firestore.DocumentData) {
					games.push(objToGame(doc, true));
				});
				setGameInvites(games);
			}
		});
		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleJoinGame(game: Game) {
		setGameId(game.id);
		history.push(Pages.table);
	}

	let markup = (
		<HomeTheme>
			<Main>
				<Centered className="join-game-panel">
					<Typography variant="subtitle1">{`Available games:`}</Typography>
					{user && gameInvites.length > 0 && (
						<List dense className="list">
							{gameInvites.map(game => {
								return (
									<ListItem
										button
										key={game.playersString + game.createdAt.toString()}
										onClick={() => handleJoinGame(game)}
									>
										<ListItemText
											color="primary"
											primary={formatDateToDay(game.createdAt)}
											secondary={game.playersString}
										/>
										<IconButton color="primary" disabled>
											<ArrowForwardIcon />
										</IconButton>
									</ListItem>
								);
							})}
						</List>
					)}
					<br></br>
					<br></br>
					<HomeButton />
				</Centered>
			</Main>
		</HomeTheme>
	);

	return user ? markup : <Login />;
};

export default JoinGame;
