import { Button, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../App';
import Controls from '../../components/Controls';
import HomeButton from '../../components/HomeButton';
import BottomPlayer from '../../components/PlayerComponents/BottomPlayer';
import LeftPlayer from '../../components/PlayerComponents/LeftPlayer';
import RightPlayer from '../../components/PlayerComponents/RightPlayer';
import TopPlayer from '../../components/PlayerComponents/TopPlayer';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { setGame, setPlayer } from '../../util/store/actions';
import { typeCheckGame } from '../../util/utilFns';
import './Table.scss';

const Table = () => {
	const { user, gameId } = useContext(AppContext);
	const [topPlayerIndex, setTopPlayerIndex] = useState(null);
	const [rightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [bottomPlayerIndex, setBottomPlayerIndex] = useState(null);
	const [leftPlayerIndex, setLeftPlayerIndex] = useState(null);
	const [front, setFront] = useState(null);
	const [back, setBack] = useState(null);

	const dispatch = useDispatch();
	const game = useSelector((state: Store) => state.game);

	useEffect(() => {
		console.log('Table - game listener called');
		const unsubscribe = firebaseService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				console.log('Table - game state updated:');
				// setGame, setPlayer
				dispatch(setGame(currentGame));
				setFront(currentGame.frontTiles);
				setBack(currentGame.backTiles);
				let player: User;
				switch (user.username) {
					case currentGame.players[0].username:
						player = currentGame.players[0];
						setLeftPlayerIndex(0);
						setTopPlayerIndex(3);
						setRightPlayerIndex(2);
						setBottomPlayerIndex(1);
						break;
					case currentGame.players[1].username:
						player = currentGame.players[1];
						setLeftPlayerIndex(1);
						setTopPlayerIndex(0);
						setRightPlayerIndex(3);
						setBottomPlayerIndex(2);
						break;
					case currentGame.players[2].username:
						player = currentGame.players[2];
						setLeftPlayerIndex(2);
						setTopPlayerIndex(1);
						setRightPlayerIndex(0);
						setBottomPlayerIndex(3);
						break;
					case currentGame.players[3].username:
						player = currentGame.players[3];
						setLeftPlayerIndex(3);
						setTopPlayerIndex(2);
						setRightPlayerIndex(1);
						setBottomPlayerIndex(0);
						break;
					default:
						break;
				}
				dispatch(setPlayer(player));
			}
		});
		return unsubscribe;
	}, []);

	async function startGame() {
		console.log('Table - creator calling startGame');
		await game.initRound().then(() => {
			firebaseService.updateGame(game).then(() => {
				setTimeout(function () {
					history.push('./Table');
				}, 1000);
			});
		});
	}

	const startControl = () => {
		return (
			<div className="main">
				<Button onClick={startGame} variant="outlined">
					{`Start game`}
				</Button>
				<br></br>
				<HomeButton />
			</div>
		);
	};

	const gameMarkup = () => {
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
				<Typography variant="h6">{`No ongoing game`}</Typography>
				<br></br>
				<HomeButton />
			</div>
		);
	};

	useEffect(() => {
		console.log('Table - re-rendering game & controls');
	}, [game, user, dispatch]);

	if (user && game) {
		if (game.creator === user.username && game.stage === 0) {
			return startControl();
		} else {
			return gameMarkup();
		}
	} else {
		return noActiveGame();
	}
};

export default Table;
