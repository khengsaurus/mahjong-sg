import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import firebase from 'firebase/app';
import React, { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { formatDateToDay, typeCheckGameRepr } from '../../util/utilFns';
import './JoinGame.scss';

const JoinGame = () => {
	const { user, setGameId, validateJWT } = useContext(AppContext);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);

	useEffect(() => {
		validateJWT();
		let games: Game[] = [];
		const unsubscribe = firebaseService.listenInvitesSnapshot(user, {
			next: (snapshot: any) => {
				snapshot.docs.forEach(function (doc: firebase.firestore.DocumentData) {
					games.push(typeCheckGameRepr(doc));
				});
				setGameInvites(games);
			}
		});
		return unsubscribe;
	}, [user, validateJWT]);

	function handleJoinGame(game: Game) {
		setGameId(game.id);
		history.push('/Table');
	}

	return (
		<div className="main">
			<Typography variant="subtitle1">Available games:</Typography>
			<List
				component="div"
				aria-labelledby="available-games"
				dense
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '250px',
					marginBottom: '10px',
					marginTop: '8px'
				}}
			>
				{user &&
					gameInvites.length > 0 &&
					gameInvites.map(game => {
						return (
							<ListItem
								button
								key={game.playersString + game.createdAt.toString()}
								style={{ border: '1px solid grey', marginBottom: '4px' }}
								onClick={() => handleJoinGame(game)}
							>
								<ListItemText
									primary={formatDateToDay(game.createdAt)}
									secondary={game.playersString}
								/>
								<ArrowForwardIcon />
							</ListItem>
						);
					})}
			</List>
			<br></br>
			<HomeButton />
		</div>
	);
};

export default JoinGame;
