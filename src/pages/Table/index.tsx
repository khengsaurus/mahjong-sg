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
import { HomeTheme } from '../../global/MuiStyles';
import { Main, TableDiv, Wind } from '../../global/StyledComponents';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { setGame, setPlayer } from '../../util/store/actions';
import { objToGame } from '../../util/utilFns';
import './table.scss';

const Table = () => {
	const { user, handleUserState, gameId, tilesSize } = useContext(AppContext);
	const [LeftPlayerIndex, setLeftPlayerIndex] = useState(null);
	const [TopPlayerIndex, setTopPlayerIndex] = useState(null);
	const [RightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [BottomPlayerIndex, setBottomPlayerIndex] = useState(null);
	const [front, setFront] = useState(null);
	const [back, setBack] = useState(null);
	const [dealer, setDealer] = useState(null);

	const dispatch = useDispatch();
	const game: Game = useSelector((state: IStore) => state.game);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log('Table/index - game listener called');
		const unsubscribe = FBService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = objToGame(gameData, false);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const gameMarkup = () => {
		if (game && game.stage !== 0) {
			let currentWind = game.repr()[0];
			let topPlayer = game.players[TopPlayerIndex];
			let rightPlayer = game.players[RightPlayerIndex];
			let bottomPlayer = game.players[BottomPlayerIndex];
			let leftPlayer = game.players[LeftPlayerIndex];
			return (
				<Main>
					<TableDiv className="safe-area">
						<Wind className="wind-background">{currentWind}</Wind>
						<div className="top-player-container">
							{topPlayer && (
								<TopPlayer
									player={topPlayer}
									dealer={dealer === TopPlayerIndex}
									hasFront={front === TopPlayerIndex}
									hasBack={back === TopPlayerIndex}
									tilesSize={tilesSize}
									lastThrown={
										game.thrownBy === TopPlayerIndex || game.whoseMove === TopPlayerIndex
											? game.lastThrown
											: null
									}
								/>
							)}
						</div>
						<div className="right-player-container">
							{rightPlayer && (
								<RightPlayer
									player={rightPlayer}
									dealer={dealer === RightPlayerIndex}
									hasFront={front === RightPlayerIndex}
									hasBack={back === RightPlayerIndex}
									tilesSize={tilesSize}
									lastThrown={
										game.thrownBy === RightPlayerIndex || game.whoseMove === RightPlayerIndex
											? game.lastThrown
											: null
									}
								/>
							)}
						</div>
						<div className="bottom-player-container">
							{bottomPlayer && (
								<BottomPlayer
									player={bottomPlayer}
									dealer={dealer === BottomPlayerIndex}
									hasFront={front === BottomPlayerIndex}
									hasBack={back === BottomPlayerIndex}
									lastThrown={
										game.thrownBy === BottomPlayerIndex || game.whoseMove === BottomPlayerIndex
											? game.lastThrown
											: null
									}
								/>
							)}
						</div>
						<div className="left-player-container">
							{leftPlayer && (
								<LeftPlayer
									player={leftPlayer}
									dealer={dealer === LeftPlayerIndex}
									hasFront={front === LeftPlayerIndex}
									hasBack={back === LeftPlayerIndex}
									tilesSize={tilesSize}
									lastThrown={
										game.thrownBy === LeftPlayerIndex || game.whoseMove === LeftPlayerIndex
											? game.lastThrown
											: null
									}
								/>
							)}
						</div>
						<Controls playerSeat={BottomPlayerIndex} />
					</TableDiv>
				</Main>
			);
		} else {
			return (
				<HomeTheme>
					<Main>
						<Typography variant="h6">{`Game has not started`}</Typography>
						<br></br>
						<HomeButton />
					</Main>
				</HomeTheme>
			);
		}
	};

	const noActiveGame = () => {
		return (
			<HomeTheme>
				<Main>
					<div className="rotated">
						<Typography variant="h6">{`No ongoing game`}</Typography>
						<br></br>
						<HomeButton />
					</div>
				</Main>
			</HomeTheme>
		);
	};

	if (user && game) {
		return gameMarkup();
	} else {
		return noActiveGame();
	}
};

export default Table;
