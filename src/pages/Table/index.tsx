import { Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { useContext, useEffect, useRef, useState } from 'react';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../components/Models/Game';
import { User } from '../../components/Models/User';
import * as firebaseService from '../../service/firebaseService';
import { setUserGame } from '../../util/fbGameFns';
import { AppContext } from '../../util/hooks/AppContext';
import { typeCheckGame } from '../../util/utilFns';

const Table = () => {
	const { user, game, setGame } = useContext(AppContext);

	const [topPlayer, setTopPlayer] = useState<User>();
	const [rightPlayer, setRightPlayer] = useState<User>();
	const [bottomPlayer, setBottomPlayer] = useState<User>();
	const [self, setSelf] = useState<User>();

	// Only the creator can start the game
	async function progressGame() {
		//FIXME: not working because game.midRound returning true even when false ??
		console.log(game.midRound === true);
		console.log(game.midRound === false);
		if (game.midRound === false) {
			console.log('Creator calling progressGame');
			// Prompt start game?
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
		const unsubscribe = firebaseService.listenToGame(game, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				setGame(currentGame);
				if (game.creator === user.username) {
					progressGame();
				}
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
	if (game && game.player1) {
		switch (user.username) {
			case game.player1.username:
				setTopPlayer(game.player4);
				setRightPlayer(game.player3);
				setBottomPlayer(game.player2);
				break;
			case game.player2.username:
				setTopPlayer(game.player1);
				setRightPlayer(game.player4);
				setBottomPlayer(game.player3);
				break;
			case game.player3.username:
				setTopPlayer(game.player2);
				setRightPlayer(game.player1);
				setBottomPlayer(game.player4);
				break;
			case game.player4.username:
				setTopPlayer(game.player3);
				setRightPlayer(game.player2);
				setBottomPlayer(game.player1);
				break;
			default:
				break;
		}
	}

	const renderTopPlayer: React.FC = () => {
		return (
			<div className="top-player-component">
				<div className="horizontal-tiles-hidden">
					{topPlayer.hiddenTiles.map((tile: Tile) => {
						return <div className="horizontal-tile-hidden" />;
					})}
				</div>
				<div className="horizontal-tiles-shown">
					{topPlayer.shownTiles.map((tile: Tile) => {
						return (
							<img
								className="horizontal-tile-shown"
								src={`../../images/tiles/${tile.card}.svg`}
								alt="../../images/tiles/无.svg"
							/>
						);
					})}
				</div>
			</div>
		);
	};

	function renderRightPlayer() {}

	function renderBottomPlayer() {}

	function renderSelf() {}

	let table = (
		<div className="main">
			{game && game.stage !== 0 ? (
				// <Typography variant="h6">{`Game ${game.id}, stage ${game.stage}`}</Typography>
				{ renderTopPlayer }
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
