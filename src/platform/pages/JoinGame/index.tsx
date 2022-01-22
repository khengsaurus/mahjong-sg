import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Collapse, List, ListItem, ListItemText, Typography } from '@mui/material';
import { history } from 'App';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { useDocumentListener } from 'platform/hooks';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Centered } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EEvent, Page } from 'shared/enums';
import { Game } from 'shared/models';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore, setGameId } from 'shared/store';
import { formatDate } from 'shared/util';
import { objToGame } from 'shared/util/parsers';
import './joinGame.scss';

const JoinGame = () => {
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
		history.push(Page.TABLE);
	}

	const markup = () => (
		<Centered className="join-game-panel">
			<StyledText text={title} variant="h6" />
			<Collapse in={user && gameInvites?.length > 0} timeout={400}>
				<List dense className="list">
					{gameInvites?.map(game => (
						<ListItem
							button
							style={{ padding: 0, margin: 0 }}
							key={game.id}
							onClick={() => handleJoinGame(game.id)}
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
