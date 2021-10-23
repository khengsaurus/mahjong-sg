import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { history } from 'App';
import firebase from 'firebase/app';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pages, Status } from 'shared/enums';
import { Game } from 'shared/Models';
import { AppContext } from 'shared/util/hooks/AppContext';
import useSession from 'shared/util/hooks/useSession';
import { setGame, setPlayer } from 'shared/util/store/actions';
import { formatDateToDay, objToGame } from 'shared/util/utilFns';
import { Loader } from 'web/components/Loader';
import FBService from 'web/service/MyFirebaseService';
import { HomeTheme } from 'web/style/MuiStyles';
import { Centered, Main } from 'web/style/StyledComponents';
import { HomeButton, Title } from 'web/style/StyledMui';
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
								key={game.pS + game.crA.toString()}
								onClick={() => handleJoinGame(game)}
								disableRipple
							>
								<ListItemText
									primary={<Typography variant="body2">{formatDateToDay(game.crA)}</Typography>}
									secondary={<Typography variant="body2">{game.pS}</Typography>}
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
