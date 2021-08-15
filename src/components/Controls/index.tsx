import { Button, IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsIcon from '@material-ui/icons/Settings';
import SubjectIcon from '@material-ui/icons/Subject';
import * as _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { scrollToBottomOfDiv, sortTiles } from '../../util/utilFns';
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
	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [okToHu, setOkToHu] = useState(false);
	const [declareHu, setDeclareHu] = useState(false);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);
	const [showSettings, setShowSettings] = useState(false);

	const game: Game = useSelector((state: Store) => state.game);
	const player: User = useSelector((state: Store) => state.player);
	const { lastThrown, thrownBy, logs } = game;

	useEffect(() => {
		if (player && player.showTiles) {
			showHuDialog();
		}
	}, []);

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
				let consideringTiles: Tile[];
				/**
				 * Player selects 1/4 tiles -> consider those tiles
				 * Player selects 2/3 tiles -> consider those + last thrown if not empty
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
					 * Player considering 4 tiles or 1 tile (which is in player's hand) -> canKang
					 * Else -> canPong, canChi
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
					thrownBy === game.findLeft(playerSeat) &&
					consideringTiles.includes(lastThrown)
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
		game.players[thrownBy].removeFromDiscarded(lastThrown);
		player.addToHidden(lastThrown);
	}

	function acquireTile() {
		game.lastThrown = {};
		game.takenTile = true;
		game.takenBy = playerSeat;
		game.newLog(`${player.username}'s turn - to throw`);
	}

	function handleTake(kang: boolean) {
		/**
		 * If last thrown can be taken ->
		 *   Set game.whoseMove to playerSeat in case of pong/kang
		 *   Remove lastThrown from board
		 *   Each tile in meld -> show = true
		 *   Move meld (including lastThrown) from player.hiddenTiles -> player.shownTiles
		 * Else -> void, log
		 */
		if (canTakeLastThrown()) {
			takeLastThrown();
			game.whoseMove = playerSeat;
			meld.forEach(tile => {
				tile.show = true;
			});
			if (player.canPong(meld) || (meld.length === 4 && player.canKang(meld))) {
				player.pongOrKang(meld);
				if (kang) {
					game.flagProgress = true;
					game.newLog(`${player.username} kang'd ${meld[0].card}`);
					buHua();
				} else {
					game.newLog(`${player.username} pong'd ${meld[0].card}`);
				}
			} else {
				player.take(meld);
				game.newLog(`${player.username} chi'd ${lastThrown.card}`);
			}
			acquireTile();
			handleAction(game);
		} else {
			console.log(`Controls/index - ${player.username} could not take last thrown tile`);
		}
	}

	function selfKang() {
		let toKang = selectedTiles[0];
		player.selfKang(toKang);
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
			acquireTile();
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles(drawnTile ? [drawnTile] : []);
		handleAction(game);
	}

	function buHua(): Tile {
		let drawnTile: Tile;
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

	function handleThrow(tile: Tile) {
		tile.show = true;
		player.discard(tile);
		player.hiddenTiles = sortTiles(player.hiddenTiles);
		game.tileThrown(tile, playerSeat);
		handleAction(game);
	}

	function handleAction(game: Game) {
		setSelectedTiles([]);
		if (game.takenTile && game.thrownTile) {
			game.nextPlayerMove();
		} else {
			game.uncachedAction = true;
		}
		game.players[playerSeat] = player;
		console.log('Controls/index - handleAction called');
		FBService.updateGame(game);
	}

	/* ----------------------------------- Hu ----------------------------------- */

	function showHuDialog() {
		setDeclareHu(true);
		if (canTakeLastThrown()) {
			takeLastThrown();
		}
		player.hiddenTiles = sortTiles(player.hiddenTiles);
		player.showTiles = true;
		handleAction(game);
	}

	function hideHuDialog() {
		setDeclareHu(false);
		if (isHoldingLastThrown()) {
			returnLastThrown();
		}
		player.showTiles = false;
		handleAction(game);
	}

	/* ----------------------------------- Util ----------------------------------- */

	function canTakeLastThrown(): boolean {
		return !_.isEmpty(lastThrown) && game.players[thrownBy].discardedTilesContain(lastThrown);
	}

	function isHoldingLastThrown(): boolean {
		return (
			!_.isEmpty(lastThrown) &&
			player.hiddenTilesContain(lastThrown) &&
			!game.players[thrownBy].discardedTilesContain(lastThrown)
		);
	}

	function returnLastThrown() {
		player.removeFromHidden(lastThrown);
		game.players[thrownBy].addToDiscarded(lastThrown);
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

	function handleShowLogs() {
		setShowLogs(!showLogs);
		setTimeout(function () {
			scrollToBottomOfDiv('logs');
		}, 200);
	}

	function setShowTimeout() {
		setTimeoutId(
			setTimeout(function () {
				setOkToHu(false);
			}, 2000)
		);
	}

	function handleShow() {
		if (okToHu) {
			clearTimeout(timeoutId);
		}
		setOkToHu(true);
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
				{okToHu && (
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
				>
					<p>{`胡`}</p>
				</Button>
			</div>

			<div className={`bottom-right-controls-${controlsSize}`}>
				<>
					<div className="buttons">
						<IconButton className="icon-button" size="small" onClick={handleShowLogs}>
							<SubjectIcon />
						</IconButton>
						<IconButton
							className="icon-button"
							size="small"
							onClick={() => {
								setShowPay(!showPay);
							}}
						>
							<MonetizationOnIcon />
						</IconButton>
					</div>
					<div className={`log-box-container-${controlsSize}${showLogs ? ` expanded` : ``}`}>
						<LogBox
							expanded={showLogs}
							logs={logs.length <= 10 ? logs : logs.slice(logs.length - 10, logs.length)}
							scroll={() => {
								scrollToBottomOfDiv('logs');
							}}
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
