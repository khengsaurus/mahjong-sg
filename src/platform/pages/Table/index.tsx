import { ScreenOrientation } from '@ionic-native/screen-orientation';
import Typography from '@material-ui/core/Typography';
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
import { Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game } from 'shared/models';
import { setGame } from 'shared/store/actions';
import { IStore } from 'shared/typesPlus';
import { objToGame } from 'shared/util/parsers';
import './table.scss';

const Table = () => {
	const { verifyingSession } = useLocalSession();
	const { user, gameId, isLocalGame, tilesSize, setStage, setPlayers, playerSeat, setPlayerSeat } =
		useContext(AppContext);
	const { game, localGame } = useSelector((state: IStore) => state);
	const [pendingScreen, setPendingScreen] = useState(<Loader />);
	const [TopPlayerIndex, setTopPlayerIndex] = useState(null);
	const [RightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [LeftPlayerIndex, setLeftPlayerIndex] = useState(null);
	const [back, setBack] = useState(null);
	const [front, setFront] = useState(null);
	const [dealer, setDealer] = useState(null);
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

	function hydrateGame(game: Game) {
		// console.log(JSON.stringify(game));
		const { st = 0, _d = 0, fr = [0, 0], ps = [] } = game;
		setStage(st);
		setDealer(_d);
		setPlayers(ps);
		setFront(fr[0]);
		setBack(fr[1]);
		switch (user.uN) {
			case ps[0]?.uN:
				setPlayerSeat(0);
				setTopPlayerIndex(2);
				setRightPlayerIndex(1);
				setLeftPlayerIndex(3);
				break;
			case ps[1]?.uN:
				setPlayerSeat(1);
				setTopPlayerIndex(3);
				setRightPlayerIndex(2);
				setLeftPlayerIndex(0);
				break;
			case ps[2]?.uN:
				setPlayerSeat(2);
				setTopPlayerIndex(0);
				setRightPlayerIndex(3);
				setLeftPlayerIndex(1);
				break;
			case ps[3]?.uN:
				setPlayerSeat(3);
				setTopPlayerIndex(1);
				setRightPlayerIndex(0);
				setLeftPlayerIndex(2);
				break;
			default:
				break;
		}
	}

	function handleLocalGame() {
		if (!isEmpty(localGame)) {
			hydrateGame(localGame);
		}
	}

	useEffect(() => {
		const handleOnlineGame = ServiceInstance.FBListenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				const currentGame: Game = objToGame(gameData, false);
				if (!isEmpty(currentGame)) {
					hydrateGame(currentGame);
					dispatch(setGame(currentGame));
				}
			}
		});

		return gameId === 'local' || isLocalGame ? handleLocalGame() : handleOnlineGame;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameId, isLocalGame]);

	const getMarkup = () => {
		const currGame = isLocalGame ? localGame : game;
		if (!isEmpty(currGame) && currGame?.st !== 0) {
			let currentWind = currGame?.repr()[0];
			let topPlayer = currGame?.ps[TopPlayerIndex];
			let rightPlayer = currGame?.ps[RightPlayerIndex];
			let bottomPlayer = currGame?.ps[playerSeat];
			let leftPlayer = currGame?.ps[LeftPlayerIndex];
			return (
				<TableTheme>
					<Main>
						<TableDiv className="table">
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
											currGame.thB === TopPlayerIndex || currGame?.wM === TopPlayerIndex
												? currGame?.lTh
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
											currGame.thB === RightPlayerIndex || currGame?.wM === RightPlayerIndex
												? currGame?.lTh
												: null
										}
									/>
								)}
							</div>
							<div className="bottom-player-container">
								{bottomPlayer && (
									<BottomPlayer
										player={bottomPlayer}
										dealer={dealer === playerSeat}
										hasFront={front === playerSeat}
										hasBack={back === playerSeat}
										lastThrown={
											currGame.thB === playerSeat || currGame?.wM === playerSeat
												? currGame?.lTh
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
											currGame.thB === LeftPlayerIndex || currGame.wM === LeftPlayerIndex
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
