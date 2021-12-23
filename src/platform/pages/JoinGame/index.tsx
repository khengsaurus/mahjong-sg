import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { history } from 'App';
import firebase from 'firebase/app';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Centered } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Page } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game } from 'shared/models';
import { formatDate } from 'shared/util';
import { objToGame } from 'shared/util/parsers';
import './joinGame.scss';

const JoinGame = () => {
	const { user, setGameId } = useContext(AppContext);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);
	const [title, setTitle] = useState('Loading...');

	useEffect(() => {
		const unsubscribe = ServiceInstance.FBListenInvites(user, {
			next: (snapshot: any) => {
				let games: Game[] = [];
				snapshot.docs.forEach(function (doc: firebase.firestore.DocumentData) {
					games.push(objToGame(doc, true));
				});
				setGameInvites(games || []);
				setTitle(games.length === 0 ? 'No available games' : 'Available games:');
			}
		});

		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleKeyListeners = useCallback(
		e => {
			let n = Number(e.key);
			if (gameInvites[n]) {
				handleJoinGame(gameInvites[n]);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(gameInvites?.map(g => g.id))]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyListeners);
		return () => {
			document.removeEventListener('keydown', handleKeyListeners);
		};
	}, [handleKeyListeners]);

	function handleJoinGame(game: Game) {
		setGameId(game.id);
		history.push(Page.TABLE);
	}

	const markup = () => (
		<Centered className="join-game-panel">
			<Title title={title} variant="h6" padding="5px" />
			<Collapse in={user && gameInvites?.length > 0} timeout={400}>
				<List dense className="list">
					{gameInvites?.map(game => (
						<ListItem
							button
							style={{ padding: 0, margin: 0 }}
							key={game.id}
							onClick={() => handleJoinGame(game)}
							disableRipple
						>
							<ListItemText
								primary={<Typography variant="body2">{formatDate(game.cA)}</Typography>}
								secondary={<Typography variant="body2">{game.pS}</Typography>}
							/>
							<ArrowForwardIcon />
						</ListItem>
					))}
				</List>
			</Collapse>
			<HomeButton />
		</Centered>
	);

	return <HomePage markup={markup} timeout={2000} />;
};

export default JoinGame;
