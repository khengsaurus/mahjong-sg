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
import FBService from 'platform/service/MyFirebaseService';
import { HomeTheme, TableTheme } from 'platform/style/MuiStyles';
import { Centered, Main, TableDiv, Wind } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Platform, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { Game, User } from 'shared/models';
import { setGame, setPlayer } from 'shared/store/actions';
import { IStore } from 'shared/typesPlus';
import { objToGame } from 'shared/util';
import './table.scss';

const Table = () => {
	const { verifyingSession } = useLocalSession();
	const { user, gameId, tilesSize, setStage, setPlayerSeat } = useContext(AppContext);
	const game: Game = useSelector((state: IStore) => state.game);
	const [pendingScreen, setPendingScreen] = useState(<Loader />);
	const [TopPlayerIndex, setTopPlayerIndex] = useState(null);
	const [RightPlayerIndex, setRightPlayerIndex] = useState(null);
	const [BottomPlayerIndex, setBottomPlayerIndex] = useState(null);
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

	useEffect(() => {
		const unsubscribe = FBService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				const currentGame: Game = objToGame(gameData, false);
				const { st = 0, _d = 0, fr = [0, 0], ps = [] } = currentGame;
				// console.log(JSON.stringify(currentGame));
				if (!isEmpty(currentGame)) {
					setStage(st);
					setDealer(_d);
					setFront(fr[0]);
					setBack(fr[1]);
					let player: User;
					switch (user.uN) {
						case ps[0]?.uN:
							player = ps[0];
							setBottomPlayerIndex(0);
							setPlayerSeat(0);
							setLeftPlayerIndex(3);
							setTopPlayerIndex(2);
							setRightPlayerIndex(1);
							break;
						case ps[1]?.uN:
							player = ps[1];
							setBottomPlayerIndex(1);
							setPlayerSeat(1);
							setLeftPlayerIndex(0);
							setTopPlayerIndex(3);
							setRightPlayerIndex(2);
							break;
						case ps[2]?.uN:
							player = ps[2];
							setBottomPlayerIndex(2);
							setPlayerSeat(2);
							setLeftPlayerIndex(1);
							setTopPlayerIndex(0);
							setRightPlayerIndex(3);
							break;
						case ps[3]?.uN:
							player = ps[3];
							setBottomPlayerIndex(3);
							setPlayerSeat(3);
							setLeftPlayerIndex(2);
							setTopPlayerIndex(1);
							setRightPlayerIndex(0);
							break;
						default:
							break;
					}
					dispatch(setPlayer(player));
					dispatch(setGame(currentGame));
				}
			}
		});

		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMarkup = () => {
		if (game && game.st !== 0) {
			let currentWind = game.repr()[0];
			let topPlayer = game.ps[TopPlayerIndex];
			let rightPlayer = game.ps[RightPlayerIndex];
			let bottomPlayer = game.ps[BottomPlayerIndex];
			let leftPlayer = game.ps[LeftPlayerIndex];
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
											game.thB === TopPlayerIndex || game.wM === TopPlayerIndex ? game.lTh : null
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
											game.thB === RightPlayerIndex || game.wM === RightPlayerIndex
												? game.lTh
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
											game.thB === BottomPlayerIndex || game.wM === BottomPlayerIndex
												? game.lTh
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
											game.thB === LeftPlayerIndex || game.wM === LeftPlayerIndex
												? game.lTh
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
		if (!game) {
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

	return game && verifyingSession !== Status.PENDING ? (
		getMarkup()
	) : (
		<HomeTheme>
			<Main>{getPending()}</Main>
		</HomeTheme>
	);
};

export default Table;
