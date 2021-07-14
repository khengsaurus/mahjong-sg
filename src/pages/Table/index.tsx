import { Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { useContext, useEffect } from 'react';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../components/Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { setUserGame } from '../../util/fbGameFns';
import { AppContext } from '../../util/hooks/AppContext';
import { typeCheckGame } from '../../util/utilFns';

const Table = () => {
	const { user, game, setGame } = useContext(AppContext);
	game && setUserGame(user, game);

	// Only the creator can start the game
	async function startGame() {
		console.log(game.players);
		console.log(game.players[0]);
		console.log(game.players[0].username);
		if (game.players[0].username === user.username) {
			await game
				.initRound()
				.then(() => {
					setGame(game);
				})
				.then(() => {
					// firebaseService.updateGameAndUsers(game);
					firebaseService.updateGame(game);
				});
		}
	}

	useEffect(() => {
		const unsubscribe = firebaseService.listenToGame(game, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				setGame(currentGame);
				if (game.stage === 0 || !game.player1) {
					startGame();
				}
			}
		});
		return unsubscribe;
	}, []);

	let table = (
		<div className="main">
			{game && game.stage !== 0 ? (
				<Typography variant="h6">{`Game ${game.id}, stage ${game.stage}`}</Typography>
			) : (
				<Typography variant="h6">{`Game has not started`}</Typography>
			)}
			<br></br>
			<HomeButton />
		</div>
	);
	let noActiveGame = (
		<div className="main">
			<Typography variant="h6">No ongoing game</Typography>
			<br></br>
			<HomeButton />
		</div>
	);
	return user && game ? table : noActiveGame;
};

export default Table;
