import { Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Controls from '../../components/Controls';
import HomeButton from '../../components/HomeButton';
import BottomPlayer from '../../components/PlayerComponents/BottomPlayer';
import LeftPlayer from '../../components/PlayerComponents/LeftPlayer';
import RightPlayer from '../../components/PlayerComponents/RightPlayer';
import TopPlayer from '../../components/PlayerComponents/TopPlayer';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
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
	const [dealer, setDealer] = useState(null);

	const dispatch = useDispatch();
	const game: Game = useSelector((state: Store) => state.game);

	useEffect(() => {
		console.log('Table/index - game listener called');
		const unsubscribe = FBService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = typeCheckGame(gameData);
				console.log('Table/index - game state updated');
				// setGame, setPlayer
				dispatch(setGame(currentGame));
				setDealer(currentGame.dealer);
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

	const gameMarkup = () => {
		if (game && game.stage !== 0) {
			let currentWind = game.repr()[0];
			return (
				<div className="main">
					<div className="wind-background">
						<p>{currentWind}</p>
					</div>
					<div className="top-player-container">
						{game.players[topPlayerIndex] && (
							<TopPlayer
								player={game.players[topPlayerIndex]}
								dealer={dealer === topPlayerIndex}
								hasFront={front === topPlayerIndex}
								hasBack={back === topPlayerIndex}
							/>
						)}
					</div>
					<div className="bottom-player-container">
						{game.players[bottomPlayerIndex] && (
							<BottomPlayer
								player={game.players[bottomPlayerIndex]}
								dealer={dealer === bottomPlayerIndex}
								hasFront={front === bottomPlayerIndex}
								hasBack={back === bottomPlayerIndex}
							/>
						)}
					</div>
					<div className="right-player-container">
						{game.players[rightPlayerIndex] && (
							<RightPlayer
								player={game.players[rightPlayerIndex]}
								dealer={dealer === rightPlayerIndex}
								hasFront={front === rightPlayerIndex}
								hasBack={back === rightPlayerIndex}
							/>
						)}
					</div>
					<div className="self-container">
						{game.players[leftPlayerIndex] && (
							<LeftPlayer
								player={game.players[leftPlayerIndex]}
								dealer={dealer === leftPlayerIndex}
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
				<div className="rotated">
					<Typography variant="h6">{`No ongoing game`}</Typography>
					<br></br>
					<HomeButton />
				</div>
			</div>
		);
	};

	useEffect(() => {
		console.log('Table/index - re-rendering game & controls');
	}, [game, user, dispatch]);

	if (user && game) {
		return gameMarkup();
	} else {
		return noActiveGame();
	}
};

export default Table;
