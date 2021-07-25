import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../Models/Game';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { search, sortTiles } from '../../util/utilFns';
import './Controls.scss';
import HuAnnouncement from './HuAnnouncement';
import HuDialog from './HuDialog';

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

	const game = useSelector((state: Store) => state.game);
	const player = useSelector((state: Store) => state.player);
	const { lastThrown, thrownBy } = game;

	const previousPlayer = useMemo(() => {
		console.log('Controls - useMemo calculating previous player');
		if (playerSeat === 0) {
			return 3;
		} else {
			return playerSeat - 1;
		}
	}, [playerSeat]);

	useEffect(() => {
		if (game && player) {
			console.log('Controls - useEffect called');
			let consideringTiles: Tile[];
			if (selectedTiles.length === 0) {
				consideringTiles = [lastThrown];
			} else {
				consideringTiles = sortTiles([...selectedTiles, lastThrown]);
			}
			setMeld(consideringTiles);

			if (!game.takenTile) {
				if (game.whoseMove === playerSeat && thrownBy === previousPlayer && player.canChi(consideringTiles)) {
					setCanChi(true);
				} else {
					setCanChi(false);
				}
				if (player.canKang(consideringTiles)) {
					setCanKang(true);
				} else if (player.canPong(consideringTiles)) {
					setCanKang(false);
					setCanPong(true);
				} else {
					setCanKang(false);
					setCanPong(false);
				}
			}
		}
	}, [game.lastThrown, selectedTiles]);

	function takeLastThrown() {
		game.players[thrownBy].discardedTiles.filter((tile: Tile) => {
			return tile.id !== lastThrown.id;
		});
		game.lastThrown = { card: '', suit: '', id: '', index: 1, show: false };
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
		game.players[playerSeat] = player;
	}

	function handleTake(kang: boolean) {
		takeLastThrown();
		if (kang) {
			game.giveTiles(1, playerSeat, true, true);
			game.flagProgress = true;
		}
		game.takenTile = true;
		game.whoseMove = playerSeat;
		game.players[playerSeat] = player;
		handleAction(game);
	}

	function selfKang() {
		if (selectedTiles.length === 1 && player.canKang(selectedTiles)) {
			let toKang = selectedTiles[0];
			let atIndex: number = search(toKang, player.shownTiles);
			player.hiddenTiles = player.hiddenTiles.filter((tile: Tile) => tile.id !== toKang.id);
			player.shownTiles = player.shownTiles.splice(atIndex, 0, toKang);
			game.takenTile = true;
			game.flagProgress = true;
			game.giveTiles(1, playerSeat, true, true);
			game.players[playerSeat] = player;
			handleAction(game);
		}
	}

	function handleDraw() {
		console.log(`${player.username} is drawing a tile`);
		let initNoHiddenTiles = player.hiddenTiles.length;
		game.giveTiles(1, playerSeat, false, true);
		while (game.players[playerSeat].hiddenTiles.length === initNoHiddenTiles) {
			console.log('Player drew a flower, drawing another tile');
			game.giveTiles(1, playerSeat, true, true);
		}
		game.takenTile = true;
		game.players[playerSeat] = player;
		handleAction(game);
	}

	function handleThrow(tileToThrow: Tile) {
		console.log(`${player.username} Player is throwing a tile`);
		tileToThrow.show = true;
		player.hiddenTiles = player.hiddenTiles.filter((tile: Tile) => {
			return tile.id !== tileToThrow.id;
		});
		player.discardedTiles.push(tileToThrow);
		player.hiddenTiles = sortTiles(player.hiddenTiles);
		game.lastThrown = tileToThrow;
		game.thrownBy = playerSeat;
		game.thrownTile = true;
		game.players[playerSeat] = player;
		handleAction(game);
	}

	function handleAction(game: Game) {
		setSelectedTiles([]);
		if (game.takenTile && game.thrownTile) {
			game.takenTile = false;
			game.thrownTile = false;
			game.uncachedAction = false;
			game.nextPlayerMove();
			game.players[playerSeat] = player;
		} else {
			game.uncachedAction = true;
			game.players[playerSeat] = player;
		}
		FBService.updateGame(game);
	}

	function showHuDialog() {
		setDeclareHu(true);
		player.shownTiles = [...player.shownTiles, ...player.hiddenTiles];
		player.hiddenTiles = [];
		game.players[playerSeat] = player;
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
		game.players[playerSeat] = player;
		handleAction(game);
	}

	return game && player ? (
		<div className="overlay-main">
			<div className="top-right-controls">
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						history.push('/');
					}}
				>
					<p>Home</p>
				</Button>
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
			</div>

			<div className="bottom-left-controls">
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={game.whoseMove !== playerSeat || game.takenTile}
				>
					<p>Draw</p>
				</Button>
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1 || game.whoseMove !== playerSeat}
				>
					<p>Throw</p>
				</Button>
			</div>

			<div className="bottom-right-controls">
				<Button className="button" variant="outlined" size="small" onClick={showHuDialog}>
					<p>Show</p>
				</Button>
			</div>
			{declareHu && <HuDialog game={game} playerSeat={playerSeat} show={declareHu} onClose={hideHuDialog} />}
			{game.hu.length === 3 && <HuAnnouncement playerSeat={playerSeat} game={game} />}
		</div>
	) : null;
};

export default Controls;
