import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import firebase from 'firebase/app';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '../../App';
import { Loader } from '../../components/Loader';
import { Pages, Status } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Centered, Main } from '../../global/StyledComponents';
import { HomeButton, Title } from '../../global/StyledMui';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import useSession from '../../util/hooks/useSession';
import { setGame, setPlayer } from '../../util/store/actions';
import { formatDateToDay, objToGame } from '../../util/utilFns';
import './joinGame.scss';

const JoinGame = () => {
	const { verifyingSession } = useSession();
	const { user, setGameId } = useContext(AppContext);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setGame(null));
		dispatch(setPlayer(null));

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
		history.push(Pages.TABLE);
	}

	const markup = (
		<Centered className="join-game-panel">
			<Title title={'Available games:'} variant="h6" padding="5px" />
			{user && gameInvites.length > 0 && (
				<List dense className="list">
					{gameInvites.map(game => {
						return (
							<ListItem
								button
								style={{ padding: 0, margin: 0 }}
								key={game.playersStr + game.createdAt.toString()}
								onClick={() => handleJoinGame(game)}
								disableRipple
							>
								<ListItemText
									primary={<Typography variant="body2">{formatDateToDay(game.createdAt)}</Typography>}
									secondary={<Typography variant="body2">{game.playersStr}</Typography>}
								/>
								<ArrowForwardIcon />
							</ListItem>
						);
					})}
				</List>
			)}
			<HomeButton />
		</Centered>
	);

	return (
		<HomeTheme>
			<Main>{verifyingSession === Status.PENDING ? <Loader /> : markup}</Main>
		</HomeTheme>
	);
};

export default JoinGame;
