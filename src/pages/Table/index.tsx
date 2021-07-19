import { Button, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import isEqual from 'lodash.isequal';
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import Controls from '../../components/Controls';
import HomeButton from '../../components/HomeButton';
import BottomPlayer from '../../components/PlayerComponents/BottomPlayer';
import LeftPlayer from '../../components/PlayerComponents/LeftPlayer';
import RightPlayer from '../../components/PlayerComponents/RightPlayer';
import TopPlayer from '../../components/PlayerComponents/TopPlayer';
import { Game } from '../../Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { typeCheckGame } from '../../util/utilFns';
import './Table.scss';

const Table = () => {
	const { user, game, setGame } = useContext(AppContext);
	const [topPlayerIndex, setTopPlayerIndex] = useState(null);
	const [rightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [bottomPlayerIndex, setBottomPlayerIndex] = useState(null);
	const [leftPlayerIndex, setLeftPlayerIndex] = useState(null);
	const [front, setFront] = useState(null);
	const [back, setBack] = useState(null);
	const [usersRef, setUsersRef] = useState<SimpleUser[]>([]);

	// Only the creator can start the game
	async function progressGame() {
		if (game.midRound === false) {
			console.log('Table: creator calling progressGame');
			await game
				.initRound(true)
				.then(() => {
					firebaseService.updateGame(game);
				})
				.then(() => {
					setGame(game);
				});
		}
	}

	useEffect(() => {
		console.log('useEffect called');
		const unsubscribe = firebaseService.listenToGame(game, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				console.log(currentGame);
				setGame(currentGame);

				// Do not reset player positions if they have been set
				let simpleUsers: SimpleUser[] =
					game && game.players
						? game.players.map(player => {
								return { username: player.username, id: player.id };
						  })
						: [];
				setFront(game.frontTiles);
				setBack(game.backTiles);
				setUsersRef(simpleUsers);
				// let usernames: string[] =
				// 	game && game.players
				// 		? game.players.map(player => {
				// 				return player.username;
				// 		  })
				// 		: [];
				// if (game.players && !isEqual(usernamesRef.current, usernames)) {
				// 	usernamesRef.current = usernames;
				// 	setPlayerPositions();
				// 	setFront(game.frontTiles);
				// 	setBack(game.backTiles);
				// }
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
	useMemo(() => {
		if (game && user && usersRef.length > 0) {
			console.log('Setting player positions');
			switch (user.username) {
				case usersRef[0].username:
					setLeftPlayerIndex(0);
					setTopPlayerIndex(3);
					setRightPlayerIndex(2);
					setBottomPlayerIndex(1);
					break;
				case usersRef[1].username:
					setLeftPlayerIndex(1);
					setTopPlayerIndex(0);
					setRightPlayerIndex(3);
					setBottomPlayerIndex(2);
					break;
				case usersRef[2].username:
					setLeftPlayerIndex(2);
					setTopPlayerIndex(1);
					setRightPlayerIndex(0);
					setBottomPlayerIndex(3);
					break;
				case usersRef[3].username:
					setLeftPlayerIndex(3);
					setTopPlayerIndex(2);
					setRightPlayerIndex(1);
					setBottomPlayerIndex(0);
					break;
				default:
					break;
			}
		}
	}, [usersRef]);

	const renderCenterControl = () => {
		return (
			<div className="main">
				<Button onClick={progressGame} variant="outlined">
					{game.ongoing ? (game.stage === 0 ? 'Start game' : 'Next round') : 'Game has ended'}
				</Button>
			</div>
		);
	};

	const renderGame = () => {
		if (game && game.stage !== 0) {
			return (
				<div className="main">
					<div className="top-player-container">
						{game.players[topPlayerIndex] && (
							<TopPlayer
								player={game.players[topPlayerIndex]}
								hasFront={front === topPlayerIndex}
								hasBack={back === topPlayerIndex}
							/>
						)}
					</div>
					<div className="bottom-player-container">
						{game.players[bottomPlayerIndex] && (
							<BottomPlayer
								player={game.players[bottomPlayerIndex]}
								hasFront={front === bottomPlayerIndex}
								hasBack={back === bottomPlayerIndex}
							/>
						)}
					</div>
					<div className="right-player-container">
						{game.players[rightPlayerIndex] && (
							<RightPlayer
								player={game.players[rightPlayerIndex]}
								hasFront={front === rightPlayerIndex}
								hasBack={back === rightPlayerIndex}
							/>
						)}
					</div>
					<div className="self-container">
						{game.players[leftPlayerIndex] && (
							<LeftPlayer
								player={game.players[leftPlayerIndex]}
								hasFront={front === leftPlayerIndex}
								hasBack={back === leftPlayerIndex}
							/>
						)}
					</div>
					<Controls playerSeat={leftPlayerIndex} />
				</div>
			);
		} else {
			return (
				<div className="main">
					<Typography variant="h6">{`Game has not started`}</Typography>
					<br></br>
					<HomeButton />
				</div>
			);
		}
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

	try {
		if (user && game) {
			if (game.creator === user.username && (game.stage === 0 || !game.ongoing)) {
				return renderCenterControl();
			} else {
				return renderGame();
			}
		} else {
			return noActiveGame();
		}
	} catch (err) {
		return noActiveGame();
	}
};

export default Table;

// <Typography variant="h6">{`Game ${game.id}, stage ${game.stage}`}</Typography>
