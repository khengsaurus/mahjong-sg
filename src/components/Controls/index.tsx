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
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { search, sortTiles } from '../../util/utilFns';
import Announcement from './Announcement';
import './Controls.scss';
import './ControlsLarge.scss';
import HuDialog from './HuDialog';
import LogBox from './LogBox';
import PaymentWindow from './PaymentWindow';
import SettingsWindow from './SettingsWindow';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = (props: ControlsProps) => {
	const { playerSeat } = props;
	const { controlsSize, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const [meld, setMeld] = useState<Tile[]>([]);
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [okToShow, setOkToShow] = useState(false);
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);

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
			if (game.takenTile) {
				/**
				 * If a tile has been taken by any player, options -> false
				 * If not player's turn, canChi -> false
				 */
				setCanKang(false);
				setCanPong(false);
				setCanChi(false);
			} else {
				if (game.whoseMove !== playerSeat) {
					setCanChi(false);
				}
				let consideringTiles: Tile[];
				/**
				 * If player selects 1/4 tiles, player is considering those tiles
				 * If player selects 2/3 tiles, player is considering those, + last thrown if not empty
				 */
				if (selectedTiles.length === 1 || selectedTiles.length === 4) {
					consideringTiles = sortTiles(selectedTiles);
				} else {
					consideringTiles = sortTiles(
						_.isEmpty(lastThrown) ? selectedTiles : [...selectedTiles, lastThrown]
					);
				}
				setMeld(consideringTiles);
				if (
					/**
					 * If player considering 4 tiles or 1 tile (which is in player's hand) -> canKang ?
					 * Else -> canPong ?
					 * Else -> canChi ?
					 */
					consideringTiles.length === 4 ||
					(consideringTiles.length === 1 && consideringTiles[0] !== lastThrown)
				) {
					setCanKang(player.canKang(consideringTiles));
					setCanPong(false);
					setCanChi(false);
				} else if (player.canPong(consideringTiles)) {
					setCanKang(false);
					setCanPong(true);
					setCanChi(false);
				} else if (
					game.whoseMove === playerSeat &&
					consideringTiles.includes(lastThrown) &&
					thrownBy === previousPlayer
				) {
					setCanKang(false);
					setCanPong(false);
					setCanChi(player.canChi(consideringTiles));
				} else {
					setCanKang(false);
					setCanPong(false);
					setCanChi(false);
				}
			}
		}
	}, [lastThrown, selectedTiles]);

	/* ----------------------------------- Take ----------------------------------- */

	function takeLastThrown() {
		game.players[thrownBy].discardedTiles = game.players[thrownBy].discardedTiles.filter((tile: Tile) => {
			return tile.id !== lastThrown.id;
		});
		// game.lastThrown = {};
	}

	function takenTile() {
		game.takenTile = true;
		game.takenBy = playerSeat;
		game.newLog(`${player.username}'s turn - to throw`);
	}

	function handleTake(kang: boolean) {
		/**
		 * Set game.whoseMove to playerSeat in case of pong/kang
		 * Remove lastThrown from board
		 * Each tile in meld -> show = true
		 * Move meld (including lastThrown) from player.hiddenTiles -> player.shownTiles
		 *
		 */
		game.whoseMove = playerSeat;
		takeLastThrown();
		meld.forEach(tile => {
			tile.show = true;
		});
		player.hiddenTiles = player.hiddenTiles.filter((tile: Tile) => {
			// return !meld
			// 	.map(tileM => {
			// 		return tileM.id;
			// 	})
			// 	.includes(tileH.id);
			return !meld.includes(tile);
		});
		player.shownTiles = [...player.shownTiles, ...meld];
		if (player.canPong(meld) || (meld.length === 4 && player.canKang(meld))) {
			player.pongs.push(meld[0].card);
			if (kang) {
				game.flagProgress = true;
				game.newLog(`${player.username} kang'd ${meld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${meld[0].card}`);
			}
		} else {
			game.newLog(`${player.username} chi'd ${lastThrown.card}`);
		}
		takenTile();
		handleAction(game);
	}

	function selfKang() {
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

	/* ----------------------------------- Draw ----------------------------------- */

	function handleDraw() {
		let drawnTile: Tile;
		if (game.tiles.length > 15) {
			drawnTile = game.giveTiles(1, playerSeat, false, true);
			if (drawnTile.suit === '花' || drawnTile.suit === '动物') {
				drawnTile = buHua();
			}
			takenTile();
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles(drawnTile ? [drawnTile] : []);
		handleAction(game);
	}

	function buHua(): Tile {
		let drawnTile: Tile = null;
		let initNoHiddenTiles = player.hiddenTiles.length;
		while (player.hiddenTiles.length === initNoHiddenTiles) {
			if (game.tiles.length > 15) {
				drawnTile = game.giveTiles(1, playerSeat, true, true);
			} else {
				game.newLog(`${player.username} trying to bu hua but 15 tiles left`);
				game.draw = true;
				game.endRound();
				break;
			}
		}
		return drawnTile;
	}

	/* ----------------------------------- Throw ----------------------------------- */

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

	/* ----------------------------------- Hu ----------------------------------- */

	function showHuDialog() {
		setDeclareHu(true);
		if (!game.takenTile && !_.isEmpty(lastThrown)) {
			player.shownTiles = [...player.shownTiles, ...player.hiddenTiles, lastThrown];
		} else {
			player.shownTiles = [...player.shownTiles, ...player.hiddenTiles];
		}
		player.hiddenTiles = [];
		handleAction(game);
	}

	function hideHuDialog() {
		setDeclareHu(false);
		returnLastThrown();
		player.hiddenTiles = player.shownTiles.filter((tile: Tile) => {
			return tile.show === false && tile.id !== lastThrown.id;
		});
		player.shownTiles = player.shownTiles.filter((tile: Tile) => {
			return tile.show === true && tile.id !== lastThrown.id;
		});
		handleAction(game);
	}

	/* ----------------------------------- Util ----------------------------------- */

	function returnLastThrown() {
		game.players[thrownBy].discardedTiles = [...game.players[thrownBy].discardedTiles, lastThrown];
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

	function scrollToBottom() {
		try {
			let logsList = document.getElementById('logs');
			logsList.scrollTop = logsList.scrollHeight + 10;
		} catch (err) {
			console.log(`Div with id 'logs' not found`);
		}
	}

	function handleShowLogs() {
		setShowLogs(!showLogs);
		setTimeout(function () {
			scrollToBottom();
		}, 200);
	}

	function setShowTimeout() {
		setTimeoutId(
			setTimeout(function () {
				setOkToShow(false);
			}, 2000)
		);
	}

	function handleShow() {
		if (okToShow) {
			clearTimeout(timeoutId);
		}
		setOkToShow(true);
		setShowTimeout();
	}

	/* ----------------------------------- Markup ----------------------------------- */

	return game && player ? (
		<div className="main transparent">
			<div className={`top-right-controls-${controlsSize}`}>
				<>
					<div className="buttons">
						<IconButton
							className="icon-button"
							size="small"
							onClick={() => {
								history.push('/');
							}}
						>
							<HomeIcon />
						</IconButton>
						<IconButton
							className="icon-button"
							size="small"
							onClick={() => {
								setShowSettings(!showSettings);
							}}
						>
							<SettingsIcon />
						</IconButton>
					</div>
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

			<div className={`top-left-controls-${controlsSize}`}>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						handleTake(false);
					}}
					disabled={!canChi}
				>
					<p>{`吃`}</p>
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
					<p>{canKang ? `杠` : `碰`}</p>
				</Button>
				{okToShow && (
					<Button
						className="button"
						variant="outlined"
						size="small"
						onClick={showHuDialog}
						disabled={game.hu.length === 3}
					>
						<p>{`开`}</p>
					</Button>
				)}
			</div>

			<div className={`bottom-left-controls-${controlsSize}`}>
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1 || game.whoseMove !== playerSeat || !game.takenTile}
				>
					<p>{`丢`}</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={game.whoseMove !== playerSeat || game.takenTile}
				>
					<p>{game.tiles.length === 15 ? `结束` : `摸`}</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={handleShow}
					// onClick={e => {
					// 	e.preventDefault();
					// 	game.newLog(`Test: ${Math.random()}`);
					// 	FBService.updateGame(game);
					// }}
					// onTouchStart={() => {
					// 	setOkToShow(true);
					// }}
					// onTouchEnd={() => {
					// 	setOkToShow &&
					// 		setTimeout(function () {
					// 			setOkToShow(false);
					// 		}, 3000);
					// }}
				>
					<p>{`胡`}</p>
				</Button>
			</div>

			<div className={`bottom-right-controls-${controlsSize}`}>
				<>
					<IconButton
						className="icon-button"
						size="small"
						onClick={() => {
							setShowPay(!showPay);
						}}
					>
						<MonetizationOnIcon />
					</IconButton>
					<IconButton className="icon-button" size="small" onClick={handleShowLogs}>
						<SubjectIcon />
					</IconButton>
					<div className={`log-box-container-${controlsSize}${showLogs ? ` expanded` : ``}`}>
						<LogBox
							expanded={showLogs}
							logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
							scroll={scrollToBottom}
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
			{showSettings && (
				<SettingsWindow
					show={showSettings}
					onClose={() => {
						setShowSettings(false);
					}}
				/>
			)}
			{declareHu && <HuDialog game={game} playerSeat={playerSeat} show={declareHu} onClose={hideHuDialog} />}
			{(game.hu.length === 3 || game.draw) && <Announcement playerSeat={playerSeat} game={game} />}
		</div>
	) : null;
};

export default Controls;
