import { Button, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import isEqual from 'lodash.isequal';
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import HomeButton from '../../components/HomeButton';
import { Game } from '../../components/Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { typeCheckGame } from '../../util/utilFns';
import BottomPlayer from './BottomPlayer';
import RightPlayer from './RightPlayer';
import Self from './Self';
import './table.scss';
import TopPlayer from './TopPlayer';

const Table = () => {
	const { user, game, setGame } = useContext(AppContext);

	const [topPlayerIndex, setTopPlayerIndex] = useState(null);
	const [rightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [bottomPlayerIndex, setBottomPlayerIndex] = useState(null);
	const [selfIndex, setSelfIndex] = useState(null);
	const usernamesRef = useRef<string[]>([]);

	// Only the creator can start the game
	async function progressGame() {
		if (game.midRound === false) {
			console.log('Table: creator calling progressGame');
			await game.initRound(true).then(() => {
				firebaseService.updateGame(game);
			});
		}
	}

	useEffect(() => {
		console.log('useEffect called');
		const unsubscribe = firebaseService.listenToGame(game, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				console.log(currentGame);

				// Do not reset player positions if they have been set
				let usernames: string[] =
					game && game.players
						? game.players.map(player => {
								return player.username;
						  })
						: [];
				if (game.players && !isEqual(usernamesRef.current, usernames)) {
					usernamesRef.current = usernames;
					setPlayerPositions();
				}
				setGame(currentGame);
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
				setSelfIndex(0);
				setTopPlayerIndex(3);
				setRightPlayerIndex(2);
				setBottomPlayerIndex(1);
				break;
			case game.players[1].username:
				setSelfIndex(1);
				setTopPlayerIndex(0);
				setRightPlayerIndex(3);
				setBottomPlayerIndex(2);
				break;
			case game.players[2].username:
				setSelfIndex(2);
				setTopPlayerIndex(1);
				setRightPlayerIndex(0);
				setBottomPlayerIndex(3);
				break;
			case game.players[3].username:
				setSelfIndex(3);
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
			</div>
		);
	};

	const renderGame = () => {
		if (game && game.stage !== 0) {
			return (
				<div className="main">
					<div className="top-player-container">
						{game.players[topPlayerIndex] && <TopPlayer player={game.players[topPlayerIndex]} />}
					</div>
					<div className="bottom-player-container">
						{game.players[bottomPlayerIndex] && <BottomPlayer player={game.players[bottomPlayerIndex]} />}
					</div>
					<div className="right-player-container">
						{game.players[rightPlayerIndex] && <RightPlayer player={game.players[rightPlayerIndex]} />}
					</div>
					<div className="self-container">
						{game.players[selfIndex] && <Self player={game.players[selfIndex]} />}
					</div>
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
