import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Collapse, List, ListItem, ListItemText, Typography } from '@mui/material';
import { HomeButton } from 'components/Buttons';
import { useDocumentListener } from 'hooks';
import HomePage from 'pages/Home/HomePage';
import ServiceInstance from 'service/ServiceLayer';
import { Centered } from 'style/StyledComponents';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EEvent, Page } from 'enums';
import { AppContext } from 'hooks';
import { Game } from 'models';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import { setGameId } from 'store/actions';
import { formatDate } from 'utility';
import { objToGame } from 'utility/parsers';
import './joinGame.scss';

const JoinGame = () => {
	const { navigate } = useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);
	const [title, setTitle] = useState('Loading...');
	const dispatch = useDispatch();

	useEffect(() => {
		let didUnmount = false;

		async function unsubscribe() {
			if (!didUnmount) {
				ServiceInstance.FBListenInvites(user, {
					next: (snapshot: any) => {
						let games: Game[] = [];
						snapshot.docs.forEach(function (doc: any) {
							games.push(objToGame(doc, true));
						});
						setGameInvites(games || []);
						setTitle(games.length === 0 ? HomeScreenText.NO_AVAIL_GAMES : HomeScreenText.AVAIL_GAMES);
					}
				});
			}
		}

		unsubscribe();
		return () => {
			didUnmount = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleKeyListeners = useCallback(
		e => {
			let n = Number(e.key);
			if (gameInvites[n]?.id) {
				handleJoinGame(gameInvites[n].id);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(gameInvites?.map(g => g.id))]
	);
	useDocumentListener(EEvent.KEYDOWN, handleKeyListeners);

	function handleJoinGame(gameId: string) {
		dispatch(setGameId(gameId));
		navigate(Page.TABLE);
	}

	const markup = () => (
		<Centered className="join-game-panel">
			<Collapse in={user && gameInvites?.length > 0} timeout={400}>
				<List dense className="list" style={{ marginBottom: 10 }}>
					{gameInvites?.map(game => (
						<ListItem
							button
							style={{ padding: 0, margin: 0 }}
							key={game.id}
							onClick={() => handleJoinGame(game.id)}
							disableRipple
						>
							<ListItemText
								primary={<Typography variant="body2">{formatDate(game.t[0]) || ''}</Typography>}
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

	return <HomePage markup={markup} title={title} timeout={2000} />;
};

export default JoinGame;
