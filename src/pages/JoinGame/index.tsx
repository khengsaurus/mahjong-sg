import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import firebase from 'firebase/app';
import React, { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../Models/Game';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { formatDateToDay, typeCheckGameRepr } from '../../util/utilFns';
import Login from '../Login';
import './JoinGame.scss';

const JoinGame = () => {
	const { user, setGameId, validateJWT } = useContext(AppContext);
	const [gameInvites, setGameInvites] = useState<Game[]>([]);

	useEffect(() => {
		if (!user) {
			validateJWT();
		}
		let games: Game[] = [];
		const unsubscribe = FBService.listenInvitesSnapshot(user, {
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

	let markup = (
		<div className="main">
			<div className="join-game-panel">
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
										primary={formatDateToDay(game.createdAt)}
										secondary={game.playersString}
									/>
									<ArrowForwardIcon />
								</ListItem>
							);
						})}
					</List>
				)}
				<br></br>
				<br></br>
				<HomeButton />
			</div>
			{/* <LoadingSpinner show={loading} /> */}
		</div>
	);

	return user ? markup : <Login />;
};

export default JoinGame;
