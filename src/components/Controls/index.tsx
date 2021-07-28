import { Button } from '@material-ui/core';
import * as _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../Models/Game';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { search, sortTiles } from '../../util/utilFns';
import Announcement from './Announcement';
import './Controls.scss';
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
			if (selectedTiles.length === 1 || selectedTiles.length === 4) {
				consideringTiles = selectedTiles;
			}
			if (_.isEmpty(game.lastThrown)) {
				consideringTiles = sortTiles(selectedTiles);
			} else {
				consideringTiles = sortTiles([...selectedTiles, game.lastThrown]);
			}
			setMeld(consideringTiles);
			console.log(consideringTiles);

			if (player.canKang(consideringTiles)) {
				setCanKang(true);
			} else {
				setCanKang(false);
			}
			if (!game.takenTile) {
				if (game.whoseMove === playerSeat && thrownBy === previousPlayer && player.canChi(consideringTiles)) {
					setCanChi(true);
				} else {
					setCanChi(false);
				}
				if (player.canPong(consideringTiles)) {
					setCanKang(false);
					setCanPong(true);
				} else {
					setCanKang(false);
					setCanPong(false);
				}
			}
		}
	}, [game.lastThrown, selectedTiles]);

	function handleTake(kang: boolean) {
		game.players[thrownBy].discardedTiles.filter((tile: Tile) => {
			return tile.id !== lastThrown.id;
		});
		game.lastThrown = {};
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
		}
		if (kang) {
			game.flagProgress = true;
			buHua();
		}
		game.takenTile = true;
		game.whoseMove = playerSeat;
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
				console.log('Player drew a flower, drawing another tile');
				drawnTile = game.giveTiles(1, playerSeat, true, true);
			} else {
				console.log('Player drew a flower but cannot bu hua');
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
			console.log(`${player.username} is drawing a tile`);
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

	return game && player ? (
		<div className="main transparent">
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
					<p>{game.tiles.length === 15 ? `End` : `Draw`}</p>
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
			{(game.hu.length === 3 || game.draw) && <Announcement playerSeat={playerSeat} game={game} />}
		</div>
	) : null;
};

export default Controls;
