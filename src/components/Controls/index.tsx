import { Button, IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import SubjectIcon from '@material-ui/icons/Subject';
import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { search, sortTiles } from '../../util/utilFns';
import Announcement from './Announcement';
import './Controls.scss';
import HuDialog from './HuDialog';
import LogBox from './LogBox';
import PaymentWindow from './PaymentWindow';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = (props: ControlsProps) => {
	const { playerSeat } = props;
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const [meld, setMeld] = useState<Tile[]>([]);
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [okToShow, setOkToShow] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);

	const game: Game = useSelector((state: Store) => state.game);
	const player: User = useSelector((state: Store) => state.player);
	const { lastThrown, thrownBy, logs } = game;

	const previousPlayer = useMemo(() => {
		console.log('Controls/index - useMemo calculating previous player');
		if (playerSeat === 0) {
			return 3;
		} else {
			return playerSeat - 1;
		}
	}, [playerSeat]);

	useEffect(() => {
		if (game && player) {
			console.log(`Controls/index - useEffect to set options called`);
			let consideringTiles: Tile[];
			if (selectedTiles.length === 1 || selectedTiles.length === 4) {
				consideringTiles = selectedTiles;
			} else if (_.isEmpty(game.lastThrown)) {
				consideringTiles = sortTiles(selectedTiles);
			} else {
				consideringTiles = sortTiles([...selectedTiles, game.lastThrown]);
			}
			setMeld(consideringTiles);

			if (!game.takenTile) {
				if (player.canKang(consideringTiles)) {
					// can kang
					setCanKang(true);
					setCanPong(false);
				} else if (player.canPong(consideringTiles)) {
					// can pong
					setCanKang(false);
					setCanPong(true);
				} else if (
					// can chi
					game.whoseMove === playerSeat &&
					thrownBy === previousPlayer &&
					player.canChi(consideringTiles)
				) {
					setCanChi(true);
				} else {
					setCanKang(false);
					setCanPong(false);
					setCanChi(false);
				}
			}
		}
	}, [game.lastThrown, selectedTiles]);

	function handleTake(kang: boolean) {
		game.whoseMove = playerSeat;
		game.players[thrownBy].discardedTiles = game.players[thrownBy].discardedTiles.filter((tile: Tile) => {
			return tile.id !== lastThrown.id;
		});
		console.log(game.players[thrownBy].discardedTiles);
		meld.forEach(tile => {
			tile.show = true;
		});
		player.hiddenTiles = player.hiddenTiles.filter((tileH: Tile) => {
			return !meld
				.map(tileM => {
					return tileM.id;
				})
				.includes(tileH.id);
		});
		player.shownTiles = [...player.shownTiles, ...meld];
		if (player.canPong(meld) || player.canKang(meld)) {
			player.pongs.push(meld[0].card);
			if (kang) {
				game.flagProgress = true;
				game.newLog(`${player.username} kang'd ${meld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${meld[0].card}`);
			}
		} else {
			game.newLog(`${player.username} chi'd ${game.lastThrown.card}`);
		}
		// game.lastThrown = {};
		game.takenTile = true;
		handleAction(game);
	}

	function selfKang() {
		if (selectedTiles.length === 1 && player.canKang(selectedTiles)) {
			let toKang = selectedTiles[0];
			let atIndex: number = search(toKang, player.shownTiles);
			let initLength = player.shownTiles.length;
			player.hiddenTiles = player.hiddenTiles.filter((tile: Tile) => tile.id !== toKang.id);
			player.shownTiles = [
				...player.shownTiles.slice(0, atIndex),
				toKang,
				...player.shownTiles.slice(atIndex, initLength)
			];
			game.flagProgress = true;
			buHua();
			handleAction(game);
		}
	}

	function buHua(): Tile {
		let drawnTile: Tile;
		let initNoHiddenTiles = player.hiddenTiles.length;
		while (player.hiddenTiles.length === initNoHiddenTiles) {
			if (game.tiles.length > 15) {
				drawnTile = game.giveTiles(1, playerSeat, true, true);
			} else {
				game.newLog(`${player.username} drew a flower but cannot bu hua`);
				game.draw = true;
				game.endRound();
				drawnTile = null;
				break;
			}
		}
		return drawnTile;
	}

	function handleDraw() {
		let drawnTile: Tile;
		if (game.tiles.length > 15) {
			drawnTile = game.giveTiles(1, playerSeat, false, true);
			if (drawnTile.suit === '花' || drawnTile.suit === '动物') {
				drawnTile = buHua();
			}
			game.takenTile = true;
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles([drawnTile]);
		handleAction(game);
	}

	function handleThrow(tileToThrow: Tile) {
		tileToThrow.show = true;
		player.hiddenTiles = player.hiddenTiles.filter((tile: Tile) => {
			return tile.id !== tileToThrow.id;
		});
		player.discardedTiles.push(tileToThrow);
		player.hiddenTiles = sortTiles(player.hiddenTiles);
		game.lastThrown = tileToThrow;
		game.thrownBy = playerSeat;
		game.thrownTile = true;
		game.newLog(`${player.username} discarded ${tileToThrow.card}`);
		handleAction(game);
	}

	function handleAction(game: Game) {
		setSelectedTiles([]);
		if (game.takenTile && game.thrownTile) {
			game.takenTile = false;
			game.thrownTile = false;
			game.uncachedAction = false;
			game.nextPlayerMove();
		} else {
			game.uncachedAction = true;
		}
		game.players[playerSeat] = player;
		FBService.updateGame(game);
	}

	function showHuDialog() {
		setDeclareHu(true);
		player.shownTiles = [...player.shownTiles, ...player.hiddenTiles];
		player.hiddenTiles = [];
		handleAction(game);
	}

	function hideHuDialog() {
		setDeclareHu(false);
		let hiddenTiles = player.shownTiles.filter((tile: Tile) => {
			return tile.show === false;
		});
		player.hiddenTiles = hiddenTiles;
		player.shownTiles = player.shownTiles.filter((tile: Tile) => {
			return tile.show === true;
		});
		handleAction(game);
	}

	function goHome() {
		history.push('/');
	}

	function playerWind(): string {
		let dealerSeat = game.dealer;
		switch ((playerSeat - dealerSeat + 4) % 4) {
			case 0:
				return '東';
			case 1:
				return '南';
			case 2:
				return '西';
			case 3:
				return '北';
			default:
				return '';
		}
	}

	return game && player ? (
		<div className="main transparent">
			<div className="top-right-controls">
				<>
					<IconButton className="icon-button" size="small" onClick={goHome}>
						<HomeIcon />
					</IconButton>
					<IconButton className="icon-button" size="small">
						<SettingsIcon />
					</IconButton>
					<div className="text-container">
						{`Dealer: ${game.players[game.dealer].username}`}
						<br></br>
						{`Tiles left: ${game.tiles.length}`}
						<br></br>
						{`Seat: ${playerWind()}`}
						<br></br>
						{`$${Math.round(Number(player.balance) * 100) / 100}`}
					</div>
				</>
			</div>

			<div className="top-left-controls">
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						handleTake(false);
					}}
					disabled={!canChi || game.whoseMove !== playerSeat}
				>
					<p>Chi</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						if (selectedTiles.length === 1 && player.canKang(selectedTiles)) {
							selfKang();
						} else {
							handleTake(canKang);
						}
					}}
					disabled={!canPong && !canKang}
				>
					<p>{canKang ? `Kang` : `Pong`}</p>
				</Button>
				{okToShow && (
					<Button
						className="button"
						variant="outlined"
						size="small"
						onClick={showHuDialog}
						disabled={!okToShow}
					>
						<p>{`Show`}</p>
					</Button>
				)}
			</div>

			<div className="bottom-left-controls">
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1 || game.whoseMove !== playerSeat || !game.takenTile}
				>
					<p>Throw</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={game.whoseMove !== playerSeat || game.takenTile}
				>
					<p>{game.tiles.length === 15 ? `End` : `Draw`}</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					// onClick={() => {
					// 	setOkToShow(!okToShow);
					// }}
					// onClick={e => {
					// 	e.preventDefault();
					// 	game.newLog(`Test: ${Math.random()}`);
					// 	FBService.updateGame(game);
					// }}
					onTouchStart={() => {
						setOkToShow(true);
					}}
					onTouchEnd={() => {
						setOkToShow(false);
					}}
				>
					<p>{`Show`}</p>
				</Button>
			</div>

			<div className="bottom-right-controls">
				<>
					<IconButton
						className="icon-button"
						size="small"
						onClick={() => {
							setShowPay(true);
						}}
					>
						<MonetizationOnIcon />
					</IconButton>
					<IconButton
						className="icon-button"
						size="small"
						onClick={() => {
							setShowLogs(!showLogs);
						}}
					>
						<SubjectIcon />
					</IconButton>
					<div className={showLogs ? `log-box-container expanded` : `log-box-container`}>
						<LogBox
							expanded={showLogs}
							logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
						/>
					</div>
				</>
			</div>
			{showPay && (
				<PaymentWindow
					game={game}
					playerSeat={playerSeat}
					show={showPay}
					onClose={() => {
						setShowPay(false);
					}}
				/>
			)}
			{declareHu && <HuDialog game={game} playerSeat={playerSeat} show={declareHu} onClose={hideHuDialog} />}
			{(game.hu.length === 3 || game.draw) && <Announcement playerSeat={playerSeat} game={game} />}
		</div>
	) : null;
};

export default Controls;