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
import { findLeft, scrollToBottomOfDiv, sortTiles } from '../../util/utilFns';
import Announcement from './Announcement';
import './ControlsSmall.scss';
import './ControlsMedium.scss';
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
	const [okToShow, setOkToShow] = useState(false);
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
		let tiles: Tile[] = [];
		/**
		 * Can self kang during turn & selecting 1 || 4 */
		if (game.whoseMove === playerSeat && (selectedTiles.length === 1 || selectedTiles.length === 4)) {
			tiles = selectedTiles;
			setOptions(player.canKang(tiles), false, false, tiles);
			/**
			 * Can kang during anyone's turn if last thrown tile available & selecting 3*/
		} else if (lastThrownAvailable() && selectedTiles.length === 3) {
			tiles = [...selectedTiles, lastThrown];
			setOptions(player.canKang(tiles), false, false, tiles);
		} else if (lastThrownAvailable() && selectedTiles.length === 2) {
			/**
			 * If last thrown available, can pong during anyone's turn,
			 * Can chi only during own's turn */
			tiles = player.canPong([lastThrown, ...selectedTiles])
				? [lastThrown, ...selectedTiles]
				: sortTiles([...selectedTiles, lastThrown]);
			setOptions(
				false,
				player.canPong(tiles),
				game.thrownBy === findLeft(playerSeat) && game.whoseMove === playerSeat && player.canChi(tiles),
				tiles
			);
		} else {
			setOptions(false, false, false, tiles);
		}
	}, [lastThrown, selectedTiles]);

	/* ----------------------------------- Take ----------------------------------- */
	function takeLastThrown() {
		game.players[thrownBy].removeFromDiscarded(lastThrown);
		player.getNewTile(lastThrown);
	}

	function gameStateTakenTile(resetLastThrown: boolean = false) {
		if (resetLastThrown) {
			game.lastThrown = {};
		}
		game.takenTile = true;
		game.takenBy = playerSeat;
		game.newLog(`${player.username}'s turn - to throw`);
	}

	function handleTake() {
		game.whoseMove = playerSeat;
		if (meld.includes(lastThrown)) {
			game.players[thrownBy].removeFromDiscarded(lastThrown);
		}
		meld.forEach(tile => {
			tile.show = true;
		});
		if (canKang || canPong) {
			player.pongOrKang(meld);
			if (canKang) {
				game.flagProgress = true;
				game.newLog(`${player.username} kang'd ${meld[0].card}`);
				buHua();
			} else {
				game.newLog(`${player.username} pong'd ${meld[0].card}`);
			}
		} else {
			player.moveMeldFromHiddenIntoShown(meld);
			game.newLog(`${player.username} chi'd ${lastThrown.card}`);
		}
		gameStateTakenTile(false);
		handleAction(game);
	}

	function selfKang() {
		let toKang = selectedTiles[0];
		player.selfKang(toKang);
		gameStateTakenTile(false);
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
			gameStateTakenTile(true);
		} else {
			game.draw = true;
			game.endRound();
		}
		setSelectedTiles(drawnTile ? [drawnTile] : []);
		handleAction(game);
	}

	function buHua(): Tile {
		let drawnTile: Tile;
		let initNoHiddenTiles = player.countAllHiddenTiles();
		while (player.countAllHiddenTiles() === initNoHiddenTiles) {
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
		player.setHiddenTiles();
		game.tileThrown(tile, playerSeat);
		handleAction(game);
	}

	function handleAction(game: Game) {
		setSelectedTiles([]);
		if (game.takenTile && game.thrownTile) {
			player.setHiddenTiles();
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
		if (lastThrownAvailable()) {
			takeLastThrown();
		}
		// player.hiddenTiles = sortTiles(player.hiddenTiles);
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

	function setOptions(kang: boolean, pong: boolean, chi: boolean, tiles: Tile[]) {
		setCanKang(kang);
		setCanPong(pong);
		setCanChi(chi);
		setMeld(tiles);
	}

	function lastThrownAvailable(): boolean {
		return !_.isEmpty(lastThrown) && !game.takenTile && game.players[thrownBy].lastDiscardedTileIs(lastThrown);
	}

	function isHoldingLastThrown(): boolean {
		return (
			!_.isEmpty(lastThrown) &&
			player.allHiddenTilesContain(lastThrown) &&
			!game.players[thrownBy].lastDiscardedTileIs(lastThrown)
		);
	}

	function returnLastThrown() {
		// player.removeFromHidden(lastThrown);
		player.returnNewTile();
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
						handleTake();
					}}
					disabled={!canChi}
				>
					<p>{`吃`}</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						if (selectedTiles.length === 1) {
							selfKang();
						} else {
							handleTake();
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
						<p>{`开!`}</p>
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
					disabled={game.whoseMove !== playerSeat || (game.tiles.length > 15 && game.takenTile)}
				>
					<p>{game.tiles.length === 15 ? `完` : `摸`}</p>
				</Button>
				{!okToShow && (
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
						<p>{`开?`}</p>
					</Button>
				)}
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
