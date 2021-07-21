import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../App';
import { Game } from '../../Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { search, sortTiles } from '../../util/utilFns';
import './Controls.scss';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = (props: ControlsProps) => {
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const { playerSeat } = props;
	const [meld, setMeld] = useState<Tile[]>([]);
	const [canChi, setCanChi] = useState<boolean>(false);
	const [canPong, setCanPong] = useState<boolean>(false);
	const [canKang, setCanKang] = useState<boolean>(false);

	const dispatch = useDispatch();
	const game = useSelector((state: Store) => state.game);
	const player = useSelector((state: Store) => state.player);
	const { lastThrown, thrownBy } = game;

	const previousPlayer = useMemo(() => {
		if (playerSeat === 0) {
			return 3;
		} else {
			return playerSeat - 1;
		}
	}, [playerSeat]);

	useEffect(() => {
		if (game && player) {
			console.log('Controls: useEffect called');
			let consideringTiles: Tile[];
			if (selectedTiles.length === 0) {
				consideringTiles = [lastThrown];
			} else {
				consideringTiles = sortTiles([...selectedTiles, lastThrown]);
			}
			setMeld(consideringTiles);

			if (!game.takenTile) {
				console.log(consideringTiles);
				if (
					game.whoseMove === player.currentSeat &&
					thrownBy === previousPlayer &&
					player.canChi(consideringTiles)
				) {
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
		console.log('Player is drawing a tile');
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
		console.log('Player is throwing a tile');
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
		firebaseService.updateGame(game);
	}

	async function hu() {
		// declare how many tai
		if (game.dealer === playerSeat) {
			game.flagProgress = false;
		}
		await game.endRound().then((continueGame: boolean) => {
			//
			if (continueGame) {
				// display wind & round
			} else {
				// display game has ended
			}
		});
	}

	return game && player ? (
		<div className="overlay-main">
			<div className="top-right-controls">
				<Button
					className="home-button"
					variant="outlined"
					onClick={() => {
						history.push('/');
					}}
				>
					Home
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
					Chi
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
					{canKang ? `Kang` : `Pong`}
				</Button>
			</div>

			<div className="bottom-left-controls">
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={game.whoseMove !== playerSeat || game.takenTile}
				>
					Draw
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1 || game.whoseMove !== playerSeat}
				>
					Throw
				</Button>
				{/* {game.whoseMove === playerSeat && (
					<Button
						className="button"
						variant="outlined"
						onClick={endTurn}
						// disabled={!game.takenTile || !game.thrownTile}
					>
						End turn
					</Button>
				)} */}
			</div>

			<div className="bottom-right-controls">
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						'Hu';
					}}
				>
					Hu
				</Button>
			</div>
		</div>
	) : null;
};

export default Controls;
