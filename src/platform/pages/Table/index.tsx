import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Typography } from '@mui/material';
import firebase from 'firebase/app';
import isEmpty from 'lodash.isempty';
import { HomeButton, JoinGameButton } from 'platform/components/Buttons/TextNavButton';
import Controls from 'platform/components/Controls';
import { Loader } from 'platform/components/Loader';
import BottomPlayer from 'platform/components/PlayerComponents/BottomPlayer';
import LeftPlayer from 'platform/components/PlayerComponents/LeftPlayer';
import RightPlayer from 'platform/components/PlayerComponents/RightPlayer';
import TopPlayer from 'platform/components/PlayerComponents/TopPlayer';
import { useLocalSession } from 'platform/hooks';
import ServiceInstance from 'platform/service/ServiceLayer';
import { HomeTheme, TableTheme } from 'platform/style/MuiStyles';
import { Centered, Main, TableDiv, Wind } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalFlag, Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game } from 'shared/models';
import { IStore, setGame } from 'shared/store';
import { setLocalGame, setTHK } from 'shared/store/actions';
import { findLeft, findOpp, findRight, getTileHashKey } from 'shared/util';
import { objToGame } from 'shared/util/parsers';
import './table.scss';

const Table = () => {
	const { verifyingSession } = useLocalSession(false);
	const {
		user,
		gameId,
		game,
		localGame,
		sizes: { tileSize }
	} = useSelector((state: IStore) => state);
	const { setPlayers, playerSeat, setPlayerSeat } = useContext(AppContext);
	const [pendingScreen, setPendingScreen] = useState(<Loader />);
	const isLocalGame = gameId === LocalFlag;
	const dispatch = useDispatch();

	useEffect(() => {
		if (process.env.REACT_APP_PLATFORM === Platform.MOBILE) {
			ScreenOrientation?.lock(ScreenOrientation.ORIENTATIONS.LANDSCAPE).catch(_ => {
				console.info('Platform does not support @ionic-native/screen-orientation.ScreenOrientation.lock');
			});
		}

		return () => {
			if (process.env.REACT_APP_PLATFORM === Platform.MOBILE) {
				ScreenOrientation?.unlock();
			}
		};
	}, []);

	function hydrateGame(game: Game, currUsername: string) {
		const { ps = [] } = game;
		setPlayers(ps);
		switch (currUsername) {
			case ps[0]?.uN:
				setPlayerSeat(0);
				break;
			case ps[1]?.uN:
				setPlayerSeat(1);
				break;
			case ps[2]?.uN:
				setPlayerSeat(2);
				break;
			case ps[3]?.uN:
				setPlayerSeat(3);
				break;
			default:
				break;
		}
	}

	function handleLocalGame() {
		if (!isEmpty(localGame) && user?.uN) {
			dispatch(setTHK(111));
			dispatch(setLocalGame(localGame));
			hydrateGame(localGame, user.uN);
		}
	}

	useEffect(() => {
		const handleOnlineGame = ServiceInstance.FBListenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				const currentGame: Game = objToGame(gameData, false);
				if (!isEmpty(currentGame) && user?.uN) {
					dispatch(setTHK(getTileHashKey(currentGame.id, currentGame.st)));
					hydrateGame(currentGame, user.uN);
					dispatch(setGame(currentGame));
				}
			}
		});

		return gameId === LocalFlag || isLocalGame ? handleLocalGame() : handleOnlineGame;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameId, isLocalGame, user?.uN]);

	const getMarkup = () => {
		const currGame = isLocalGame ? localGame : game;
		if (!isEmpty(currGame) && currGame?.st !== 0 && currGame?.repr) {
			const { _d = 0, fr = [0, 0], ps = [] } = currGame;
			const currentWind = currGame?.repr()[0];
			const topPlayerX = findOpp(playerSeat);
			const rightPlayerX = findRight(playerSeat);
			const leftPlayerX = findLeft(playerSeat);
			return (
				<TableTheme>
					<Main>
						<TableDiv className="table">
							<Wind className="wind-background">{currentWind}</Wind>
							<div className="top-player-container">
								{ps[topPlayerX] && (
									<TopPlayer
										player={ps[topPlayerX]}
										dealer={_d === topPlayerX}
										hasFront={fr[0] === topPlayerX}
										hasBack={fr[1] === topPlayerX}
										tileSize={tileSize}
										lastThrown={
											currGame.thB === topPlayerX || currGame?.wM === topPlayerX
												? currGame?.lTh
												: null
										}
									/>
								)}
							</div>
							<div className="right-player-container">
								{ps[rightPlayerX] && (
									<RightPlayer
										player={ps[rightPlayerX]}
										dealer={_d === rightPlayerX}
										hasFront={fr[0] === rightPlayerX}
										hasBack={fr[1] === rightPlayerX}
										tileSize={tileSize}
										lastThrown={
											currGame.thB === rightPlayerX || currGame?.wM === rightPlayerX
												? currGame?.lTh
												: null
										}
									/>
								)}
							</div>
							<div className="bottom-player-container">
								{ps[playerSeat] && (
									<BottomPlayer
										player={ps[playerSeat]}
										dealer={_d === playerSeat}
										hasFront={fr[0] === playerSeat}
										hasBack={fr[1] === playerSeat}
										lastThrown={
											currGame.thB === playerSeat || currGame?.wM === playerSeat
												? currGame?.lTh
												: null
										}
									/>
								)}
							</div>
							<div className="left-player-container">
								{ps[leftPlayerX] && (
									<LeftPlayer
										player={ps[leftPlayerX]}
										dealer={_d === leftPlayerX}
										hasFront={fr[0] === leftPlayerX}
										hasBack={fr[1] === leftPlayerX}
										tileSize={tileSize}
										lastThrown={
											currGame.thB === leftPlayerX || currGame.wM === leftPlayerX
												? currGame.lTh
												: null
										}
									/>
								)}
							</div>
							<Controls />
						</TableDiv>
					</Main>
				</TableTheme>
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

	const getPending = () => {
		if (isLocalGame ? !localGame : !game) {
			setTimeout(function () {
				setPendingScreen(
					<Centered>
						<Title title={`No ongoing game`} />
						<JoinGameButton />
						<HomeButton />
					</Centered>
				);
			}, 1000);
		}
		return pendingScreen;
	};

	return (isLocalGame ? localGame : game) && verifyingSession !== Status.PENDING ? (
		getMarkup()
	) : (
		<HomeTheme>
			<Main>{getPending()}</Main>
		</HomeTheme>
	);
};

export default Table;
