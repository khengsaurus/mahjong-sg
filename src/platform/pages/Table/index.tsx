import Typography from '@material-ui/core/Typography';
import firebase from 'firebase/app';
import isEmpty from 'lodash.isempty';
import Controls from 'platform/components/Controls';
import BottomPlayer from 'platform/components/PlayerComponents/BottomPlayer';
import LeftPlayer from 'platform/components/PlayerComponents/LeftPlayer';
import RightPlayer from 'platform/components/PlayerComponents/RightPlayer';
import TopPlayer from 'platform/components/PlayerComponents/TopPlayer';
import HomePage from 'platform/pages/HomePage';
import FBService from 'platform/service/MyFirebaseService';
import { TableTheme } from 'platform/style/MuiStyles';
import { TableDiv, Wind } from 'platform/style/StyledComponents';
import { HomeButton } from 'platform/style/StyledMui';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from 'shared/hooks';
import { Game, User } from 'shared/models';
import { setGame, setPlayer } from 'shared/store/actions';
import { objToGame } from 'shared/util';
import './table.scss';

const Table = () => {
	const { user, gameId, tilesSize, setStage, setPlayerSeat } = useContext(AppContext);
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

	const Markup: React.FC = () => {
		if (game && game.st !== 0) {
			let currentWind = game.repr()[0];
			let topPlayer = game.ps[TopPlayerIndex];
			let rightPlayer = game.ps[RightPlayerIndex];
			let bottomPlayer = game.ps[BottomPlayerIndex];
			let leftPlayer = game.ps[LeftPlayerIndex];
			return (
				<TableTheme>
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
										game.tBy === TopPlayerIndex || game.wM === TopPlayerIndex ? game.lTh : null
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
										game.tBy === RightPlayerIndex || game.wM === RightPlayerIndex ? game.lTh : null
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
										game.tBy === LeftPlayerIndex || game.wM === LeftPlayerIndex ? game.lTh : null
									}
								/>
							)}
						</div>
						<Controls />
					</TableDiv>
				</TableTheme>
			);
		} else {
			return (
				<>
					<Typography variant="h6">{`Game has not started`}</Typography>
					<br></br>
					<HomeButton />
				</>
			);
		}
	};

	return <HomePage Markup={Markup} fallbackTitle={`No ongoing game`} ready={!isEmpty(game)} />;
};

export default Table;
