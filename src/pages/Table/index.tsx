import { Button, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import isEqual from 'lodash.isequal';
import React, { useContext, useEffect, useRef, useState } from 'react';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../components/Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { typeCheckGame } from '../../util/utilFns';
import './table.scss';
import TopPlayer from './TopPlayer';

const Table = () => {
	const { user, game, setGame } = useContext(AppContext);
	const gameRef = useRef(game);

	const [topPlayerIndex, setTopPlayerIndex] = useState(0);
	const [rightPlayerIndex, setRightPlayerIndex] = useState(0);
	const [bottomPlayerIndex, setBottomPlayerIndex] = useState(0);
	const [selfIndex, setSelfIndex] = useState(0);

	// Only the creator can start the game
	async function progressGame() {
		console.log(game);
		if (game.midRound === false) {
			console.log('Creator calling progressGame');
			await game.initRound(true).then(() => {
				console.log(game);
				firebaseService.updateGame(game);
			});
		}
	}

	function checkGameUpdated() {
		return isEqual(gameRef.current, game);
	}

	useEffect(() => {
		console.log('useEffect called');
		const unsubscribe = firebaseService.listenToGame(game, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				console.log(currentGame);
				// if (!isEqual(gameRef.current, currentGame)) {
				// 	setGame(currentGame);
				// 	gameRef.current = currentGame;
				// }
				setGame(currentGame);
				game.players && setPlayerPositions();
			}
		});
		return unsubscribe;
	}, []);

	/**
	 * player1: top=player4, right=player3, bottom=player2
	 * player2: 1, 4, 3
	 * player3: 2, 1, 4
	 * player4: 1, 2, 3
	 */
	function setPlayerPositions() {
		console.log('Setting player positions');
		switch (user.username) {
			case game.players[0].username:
				setTopPlayerIndex(3);
				setRightPlayerIndex(2);
				setBottomPlayerIndex(1);
				break;
			case game.players[1].username:
				setTopPlayerIndex(0);
				setRightPlayerIndex(3);
				setBottomPlayerIndex(2);
				break;
			case game.players[2].username:
				setTopPlayerIndex(1);
				setRightPlayerIndex(0);
				setBottomPlayerIndex(3);
				break;
			case game.players[3].username:
				setTopPlayerIndex(2);
				setRightPlayerIndex(1);
				setBottomPlayerIndex(0);
				break;
			default:
				break;
		}
	}

	const renderControl = () => {
		return (
			<div className="main">
				<Button onClick={progressGame}>
					{game.ongoing ? (game.stage === 0 ? 'Start game' : 'Next round') : 'Game has ended'}
				</Button>
				<Button
					onClick={() => {
						console.log(checkGameUpdated());
					}}
				>
					Check isEqual
				</Button>
			</div>
		);
	};

	const renderGame = () => {
		return (
			<div className="main">
				{game && game.stage !== 0 ? (
					<div className="main">
						<div className="top-player-container">
							<TopPlayer player={game.players[topPlayerIndex]} />
						</div>
					</div>
				) : (
					<Typography variant="h6">{`Game has not started`}</Typography>
				)}
				<br></br>
				<HomeButton />
			</div>
		);
	};

	const noActiveGame = () => {
		return (
			<div className="main">
				<Typography variant="h6">No ongoing game</Typography>
				<br></br>
				<HomeButton />
			</div>
		);
	};

	if (user && game) {
		if (game.creator === user.username && (game.stage === 0 || !game.ongoing)) {
			return renderControl();
		} else {
			return renderGame();
		}
	} else {
		return noActiveGame();
	}
};

export default Table;

// <Typography variant="h6">{`Game ${game.id}, stage ${game.stage}`}</Typography>
