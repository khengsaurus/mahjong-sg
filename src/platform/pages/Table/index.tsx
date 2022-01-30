import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Typography } from '@mui/material';
import { history } from 'App';
import $ from 'jquery';
import { isEmpty } from 'lodash';
import { HomeButton, JoinGameButton } from 'platform/components/Buttons/TextNavButton';
import Controls from 'platform/components/Controls';
import { Loader } from 'platform/components/Loader';
import BottomPlayer from 'platform/components/PlayerComponents/BottomPlayer';
import LeftPlayer from 'platform/components/PlayerComponents/LeftPlayer';
import RightPlayer from 'platform/components/PlayerComponents/RightPlayer';
import TopPlayer from 'platform/components/PlayerComponents/TopPlayer';
import { useLocalSession } from 'platform/hooks';
import ServiceInstance from 'platform/service/ServiceLayer';
import { getHighlightColor, HomeTheme, TableTheme } from 'platform/style/MuiStyles';
import { Centered, Main, TableDiv, Wind } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalFlag, Page, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game } from 'shared/models';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { setGame, setLocalGame, setTHK } from 'shared/store/actions';
import { findLeft, findOpp, findRight, getTileHashKey, isMobile } from 'shared/util';
import { objToGame } from 'shared/util/parsers';
import './table.scss';

const Table = () => {
	const {
		user,
		gameId,
		game,
		localGame,
		sizes: { tileSize },
		theme: { tableColor }
	} = useSelector((state: IStore) => state);
	const { setPlayers, playerSeat, setPlayerSeat } = useContext(AppContext);
	const [pendingScreen, setPendingScreen] = useState(<Loader />);
	const isLocalGame = gameId === LocalFlag;
	const { verifyingSession } = useLocalSession(isLocalGame);
	const dispatch = useDispatch();

	/* ----------------------------------- Screen orientation ----------------------------------- */

	useLayoutEffect(() => {
		if (isMobile()) {
			ScreenOrientation?.lock(ScreenOrientation.ORIENTATIONS.LANDSCAPE).catch(_ => {
				console.info('Platform does not support @ionic-native/screen-orientation.ScreenOrientation.lock');
			});
		}

		return () => {
			if (isMobile()) {
				ScreenOrientation?.unlock();
			}
		};
	}, []);

	/* --------------------------------- End screen orientation --------------------------------- */

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
		let didUnmount = false;

		async function unsubscribe() {
			if (!didUnmount) {
				ServiceInstance.FBListenToGame(gameId, {
					next: (gameData: any) => {
						const currentGame: Game = objToGame(gameData, false);
						if (isEmpty(currentGame) || !user?.uN) {
							history.push(Page.HOME);
						} else {
							dispatch(setTHK(getTileHashKey(currentGame.id, currentGame.n[0])));
							hydrateGame(currentGame, user.uN);
							dispatch(setGame(currentGame));
						}
					}
				});
			}
		}

		if (!gameId) {
			history.push(Page.INDEX);
		} else {
			gameId === LocalFlag || isLocalGame ? handleLocalGame() : unsubscribe();
		}

		return () => {
			didUnmount = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameId, isLocalGame, user?.uN]);

	const currGame = isLocalGame ? localGame : game;

	useLayoutEffect(() => {
		const lTh = document.getElementById(`shown-tile-${currGame?.lTh?.r}`);
		$(lTh)?.addClass('last');

		return () => $(lTh)?.removeClass('last');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currGame?.lTh?.i]);

	const getMarkup = () => {
		if (!isEmpty(currGame) && currGame?.n[0] !== 0 && currGame?.repr) {
			const { lTh = {}, n = [], ps = [] } = currGame;
			const currentWind = currGame?.repr() && currGame?.repr()[0];
			const topPlayerX = findOpp(playerSeat);
			const rightPlayerX = findRight(playerSeat);
			const leftPlayerX = findLeft(playerSeat);
			const highlightColor = getHighlightColor(tableColor);
			return (
				<TableTheme>
					<Main>
						<TableDiv className="table">
							<Wind className="wind-background">{currentWind}</Wind>
							<div className="top-player-container">
								{ps[topPlayerX] && (
									<TopPlayer
										player={ps[topPlayerX]}
										dealer={n[2] === topPlayerX}
										hasFront={n[4] === topPlayerX}
										hasBack={n[5] === topPlayerX}
										tileSize={tileSize}
										lastThrown={n[7] === topPlayerX || n[3] === topPlayerX ? lTh : null}
										highlight={topPlayerX === n[3] ? highlightColor : ''}
									/>
								)}
							</div>
							<div className="right-player-container">
								{ps[rightPlayerX] && (
									<RightPlayer
										player={ps[rightPlayerX]}
										dealer={n[2] === rightPlayerX}
										hasFront={n[4] === rightPlayerX}
										hasBack={n[5] === rightPlayerX}
										tileSize={tileSize}
										lastThrown={n[7] === rightPlayerX || n[3] === rightPlayerX ? lTh : null}
										highlight={rightPlayerX === n[3] ? highlightColor : ''}
									/>
								)}
							</div>
							<div className="bottom-player-container">
								{ps[playerSeat] && (
									<BottomPlayer
										player={ps[playerSeat]}
										dealer={n[2] === playerSeat}
										hasFront={n[4] === playerSeat}
										hasBack={n[5] === playerSeat}
										lastThrown={n[7] === playerSeat || n[3] === playerSeat ? lTh : null}
										highlight={playerSeat === n[3] ? highlightColor : ''}
									/>
								)}
							</div>
							<div className="left-player-container">
								{ps[leftPlayerX] && (
									<LeftPlayer
										player={ps[leftPlayerX]}
										dealer={n[2] === leftPlayerX}
										hasFront={n[4] === leftPlayerX}
										hasBack={n[5] === leftPlayerX}
										tileSize={tileSize}
										lastThrown={
											n[7] === leftPlayerX || currGame.n[3] === leftPlayerX ? currGame.lTh : null
										}
										highlight={leftPlayerX === n[3] ? highlightColor : ''}
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
						<Typography variant="h6">{HomeScreenText.GAME_NOT_STARTED}</Typography>
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
						<StyledText text={HomeScreenText.NO_ONGOING_GAME} />
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
