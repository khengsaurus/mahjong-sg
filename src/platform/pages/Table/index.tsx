import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Status } from 'shared/enums';
import { AppContext } from 'shared/hooks/AppContext';
import useSession from 'shared/hooks/useSession';
import { Game, User } from 'shared/models';
import FBService from 'shared/service/MyFirebaseService';
import { setGame, setPlayer } from 'shared/store/actions';
import { objToGame } from 'shared/util';
import Controls from 'platform/components/Controls';
import { Loader } from 'platform/components/Loader';
import BottomPlayer from 'platform/components/PlayerComponents/BottomPlayer';
import LeftPlayer from 'platform/components/PlayerComponents/LeftPlayer';
import RightPlayer from 'platform/components/PlayerComponents/RightPlayer';
import TopPlayer from 'platform/components/PlayerComponents/TopPlayer';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main, TableDiv, Wind } from 'platform/style/StyledComponents';
import { HomeButton, Title } from 'platform/style/StyledMui';
import './table.scss';

const loadingScreen = (
	<HomeTheme>
		<Main>
			<Loader />
		</Main>
	</HomeTheme>
);

const noGameMarkup = (
	<HomeTheme>
		<Main>
			<Centered>
				<Title title={`No ongoing game`} />
				<HomeButton />
			</Centered>
		</Main>
	</HomeTheme>
);

const Table = () => {
	const { verifyingSession } = useSession();
	const { user, gameId, tilesSize, setStage, setPlayerSeat } = useContext(AppContext);
	const [pendingScreen, setPendingScreen] = useState(loadingScreen);
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
		const unsubscribe = FBService.listenToGame(gameId, {
			next: (gameData: firebase.firestore.DocumentData) => {
				let currentGame: Game = objToGame(gameData, false);
				dispatch(setGame(currentGame));
				setStage(currentGame.st);
				setDealer(currentGame.dealer);
				setFront(currentGame.front);
				setBack(currentGame.back);
				let player: User;
				switch (user.uN) {
					case currentGame.ps[0].uN:
						player = currentGame.ps[0];
						setBottomPlayerIndex(0);
						setPlayerSeat(0);
						setLeftPlayerIndex(3);
						setTopPlayerIndex(2);
						setRightPlayerIndex(1);
						break;
					case currentGame.ps[1].uN:
						player = currentGame.ps[1];
						setBottomPlayerIndex(1);
						setPlayerSeat(1);
						setLeftPlayerIndex(0);
						setTopPlayerIndex(3);
						setRightPlayerIndex(2);
						break;
					case currentGame.ps[2].uN:
						player = currentGame.ps[2];
						setBottomPlayerIndex(2);
						setPlayerSeat(2);
						setLeftPlayerIndex(1);
						setTopPlayerIndex(0);
						setRightPlayerIndex(3);
						break;
					case currentGame.ps[3].uN:
						player = currentGame.ps[3];
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
										game.tBy === TopPlayerIndex || game.wM === TopPlayerIndex ? game.lastT : null
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
										game.tBy === RightPlayerIndex || game.wM === RightPlayerIndex
											? game.lastT
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
										game.tBy === BottomPlayerIndex || game.wM === BottomPlayerIndex
											? game.lastT
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
										game.tBy === LeftPlayerIndex || game.wM === LeftPlayerIndex ? game.lastT : null
									}
								/>
							)}
						</div>
						<Controls />
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

	const getPending = () => {
		if (!game) {
			setTimeout(function () {
				setPendingScreen(noGameMarkup);
			}, 1000);
		}
		return pendingScreen;
	};

	return game && verifyingSession !== Status.PENDING ? getMarkup() : getPending();
};

export default Table;
