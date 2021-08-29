import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Controls from '../../components/Controls';
import HomeButton from '../../components/HomeButton';
import BottomPlayer from '../../components/PlayerComponents/BottomPlayer';
import LeftPlayer from '../../components/PlayerComponents/LeftPlayer';
import RightPlayer from '../../components/PlayerComponents/RightPlayer';
import TopPlayer from '../../components/PlayerComponents/TopPlayer';
import { Game } from '../../models/Game';
import { User } from '../../models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { setGame, setPlayer } from '../../util/store/actions';
import { objToGame } from '../../util/utilFns';
import './Table.scss';

const Table = () => {
	const { user, gameId, tilesSize } = useContext(AppContext);
	const [LeftPlayerIndex, setLeftPlayerIndex] = useState(null);
	const [TopPlayerIndex, setTopPlayerIndex] = useState(null);
	const [RightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [BottomPlayerIndex, setBottomPlayerIndex] = useState(null);
	const [front, setFront] = useState(null);
	const [back, setBack] = useState(null);
	const [dealer, setDealer] = useState(null);

	const dispatch = useDispatch();
	const game: Game = useSelector((state: Store) => state.game);

	useEffect(() => {
		console.log('Table/index - game listener called');
		const unsubscribe = FBService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = objToGame(2, gameData);
				// setGame, setPlayer
				dispatch(setGame(currentGame));
				setDealer(currentGame.dealer);
				setFront(currentGame.frontTiles);
				setBack(currentGame.backTiles);
				let player: User;
				switch (user.username) {
					case currentGame.players[0].username:
						player = currentGame.players[0];
						setBottomPlayerIndex(0);
						setLeftPlayerIndex(3);
						setTopPlayerIndex(2);
						setRightPlayerIndex(1);
						break;
					case currentGame.players[1].username:
						player = currentGame.players[1];
						setBottomPlayerIndex(1);
						setLeftPlayerIndex(0);
						setTopPlayerIndex(3);
						setRightPlayerIndex(2);
						break;
					case currentGame.players[2].username:
						player = currentGame.players[2];
						setBottomPlayerIndex(2);
						setLeftPlayerIndex(1);
						setTopPlayerIndex(0);
						setRightPlayerIndex(3);
						break;
					case currentGame.players[3].username:
						player = currentGame.players[3];
						setBottomPlayerIndex(3);
						setLeftPlayerIndex(2);
						setTopPlayerIndex(1);
						setRightPlayerIndex(0);
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
					<div className="table">
						<div className="wind-background">
							<p>{currentWind}</p>
						</div>
						<div className="left-player-container">
							{game.players[LeftPlayerIndex] && (
								<LeftPlayer
									tilesSize={tilesSize}
									player={game.players[LeftPlayerIndex]}
									dealer={dealer === LeftPlayerIndex}
									hasFront={front === LeftPlayerIndex}
									hasBack={back === LeftPlayerIndex}
									lastThrown={game.lastThrown}
								/>
							)}
						</div>
						<div className="right-player-container">
							{game.players[RightPlayerIndex] && (
								<RightPlayer
									tilesSize={tilesSize}
									player={game.players[RightPlayerIndex]}
									dealer={dealer === RightPlayerIndex}
									hasFront={front === RightPlayerIndex}
									hasBack={back === RightPlayerIndex}
									lastThrown={game.lastThrown}
								/>
							)}
						</div>
						<div className="top-player-container">
							{game.players[TopPlayerIndex] && (
								<TopPlayer
									tilesSize={tilesSize}
									player={game.players[TopPlayerIndex]}
									dealer={dealer === TopPlayerIndex}
									hasFront={front === TopPlayerIndex}
									hasBack={back === TopPlayerIndex}
									lastThrown={game.lastThrown}
								/>
							)}
						</div>
						<div className="bottom-player-container">
							{game.players[BottomPlayerIndex] && (
								<BottomPlayer
									tilesSize={tilesSize}
									player={game.players[BottomPlayerIndex]}
									dealer={dealer === BottomPlayerIndex}
									hasFront={front === BottomPlayerIndex}
									hasBack={back === BottomPlayerIndex}
									lastThrown={game.lastThrown}
								/>
							)}
						</div>
						<Controls playerSeat={BottomPlayerIndex} />
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
				<div className="rotated">
					<Typography variant="h6">{`No ongoing game`}</Typography>
					<br></br>
					<HomeButton />
				</div>
			</div>
		);
	};

	if (user && game) {
		return gameMarkup();
	} else {
		return noActiveGame();
	}
};

export default Table;
