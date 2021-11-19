import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { history } from 'App';
import firebase from 'firebase/app';
import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import FBService from 'platform/service/MyFirebaseService';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { HomeButton, Title } from 'platform/style/StyledMui';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pages, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game } from 'shared/models';
import { setGame, setPlayer } from 'shared/store/actions';
import { formatDate, objToGame } from 'shared/util';
import './joinGame.scss';

const JoinGame = () => {
	const { verifyingSession } = useLocalSession();
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
					{gameInvites.map(game => (
						<ListItem
							button
							style={{ padding: 0, margin: 0 }}
							key={game.id}
							onClick={() => handleJoinGame(game)}
							disableRipple
						>
							<ListItemText
								primary={<Typography variant="body2">{formatDate(game.crA)}</Typography>}
								secondary={<Typography variant="body2">{game.pS}</Typography>}
							/>
							<ArrowForwardIcon />
						</ListItem>
					))}
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
