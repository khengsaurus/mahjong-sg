import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { history } from '../../App';
import { User } from '../../Models/User';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { sortTiles } from '../../util/utilFns';
import './Controls.scss';

interface ControlsProps {
	playerSeat?: number;
}

const Controls = (props: ControlsProps) => {
	const { game, setGame, selectedTiles, setSelectedTiles } = useContext(AppContext);
	const { lastThrown, thrownBy } = game;
	const { playerSeat } = props;
	const [player, setPlayer] = useState<User>(null);
	const [canChi, setCanChi] = useState<boolean>(false);
	const [canPong, setCanPong] = useState<boolean>(false);
	const [canKang, setCanKang] = useState<boolean>(false);
	const [considerLastThrown, setConsiderLastThrown] = useState<boolean>(true);
	const [meld, setMeld] = useState<Tile[]>([]);
	const gameRef = useRef(game);
	const [gottenTile, setGottenTile] = useState(false);
	const [thrownTile, setThrownTile] = useState(false);

	useEffect(() => {
		game && setPlayer(game.players[playerSeat]);
	}, [game, playerSeat]);

	useEffect(() => {
		console.log(game);
		console.log(gameRef.current);
		if (!gameRef || game.whoseMove !== playerSeat) {
			console.log('Caching game');
			gameRef.current = game;
		}
	}, [game]);

	const previousPlayer = useMemo(() => {
		if (playerSeat === 0) {
			return 3;
		} else {
			return playerSeat - 1;
		}
	}, [playerSeat]);

	useEffect(() => {
		if (player) {
			// always consider unless after drawing
			if (considerLastThrown) {
				setMeld([...selectedTiles, lastThrown]);
			} else {
				setMeld([...selectedTiles]);
			}
			if (thrownBy && thrownBy === previousPlayer && player.canChi([...selectedTiles, lastThrown])) {
				setCanChi(true);
			} else {
				setCanChi(false);
			}
			if (player.canKang(meld)) {
				setCanKang(true);
			} else if (player.canPong(meld)) {
				setCanKang(false);
				setCanPong(true);
			} else {
				setCanPong(false);
			}
		}
	}, [considerLastThrown, lastThrown, previousPlayer, thrownBy, selectedTiles, player]);

	async function updateDoc() {
		game.players[playerSeat] = player;
		firebaseService.updateGame(game);
	}

	async function handleChi() {
		let tiles = sortTiles(meld);
		player.hiddenTiles = player.hiddenTiles.filter(tileH => {
			return !tiles
				.map(tileM => {
					return tileM.id;
				})
				.includes(tileH.id);
		});
		player.shownTiles = [...player.shownTiles, ...tiles];
		setSelectedTiles([]);
		setGottenTile(true);
		if (gottenTile && thrownTile) {
			endTurn();
		} else {
			updateDoc();
		}
	}

	async function handlePong(kang: boolean) {
		player.hiddenTiles = player.hiddenTiles.filter(tileH => {
			return !meld
				.map(tileM => {
					return tileM.id;
				})
				.includes(tileH.id);
		});
		player.shownTiles = [...player.shownTiles, ...meld];
		if (kang) {
			game.giveTiles(1, playerSeat, true, true);
		}
		setSelectedTiles([]);
		setGottenTile(true);
		if (gottenTile && thrownTile) {
			endTurn();
		} else {
			updateDoc();
		}
	}

	async function handleDraw() {
		console.log('Player is drawing a tile');
		setConsiderLastThrown(false);
		let initNoHiddenTiles = player.hiddenTiles.length;
		await game.giveTiles(1, playerSeat, false, true);
		while (game.players[playerSeat].hiddenTiles.length === initNoHiddenTiles) {
			console.log('Player drew a flower, drawing another tile');
			await game.giveTiles(1, playerSeat, true, true);
		}
		setGottenTile(true);
		if (gottenTile && thrownTile) {
			endTurn();
		} else {
			updateDoc();
		}
	}

	async function handleThrow(tileToThrow: Tile) {
		console.log('Player is throwing a tile');
		player.hiddenTiles = player.hiddenTiles.filter(tile => {
			return tile.id !== tileToThrow.id;
		});
		player.discardedTiles.push(tileToThrow);
		player.hiddenTiles = sortTiles(player.hiddenTiles);
		setSelectedTiles([]);
		game.lastThrown = tileToThrow;
		game.thrownBy = playerSeat;
		setThrownTile(true);
		if (gottenTile && thrownTile) {
			endTurn();
		} else {
			updateDoc();
		}
	}

	function endTurn() {
		game.nextPlayerMove();
		gameRef.current = game;
		updateDoc();
		setGottenTile(false);
		setThrownTile(false);
	}

	function undo() {
		//FIXME: TODO: HOW TO DO THIS
		console.log('Undoing move');
		setPlayer(gameRef.current.players[playerSeat]);
		setGame(gameRef.current);
		firebaseService.updateGame(gameRef.current);
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
				<Button className="button" variant="outlined" onClick={handleChi} disabled={!canChi}>
					Chi
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={() => {
						handlePong(canKang);
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
					onClick={() => {
						handleThrow(selectedTiles[0]);
					}}
					disabled={selectedTiles.length !== 1}
				>
					Throw
				</Button>
				<Button
					className="button"
					variant="outlined"
					onClick={handleDraw}
					disabled={game.whoseMove !== playerSeat}
				>
					Draw
				</Button>
			</div>

			<div className="bottom-right-controls">
				<Button
					className="button"
					variant="outlined"
					size="small"
					onClick={() => {
						console.log('Hu');
					}}
				>
					Hu
				</Button>
				<Button className="button" variant="outlined" size="small" onClick={undo}>
					Undo
				</Button>
			</div>
		</div>
	) : null;
};

export default Controls;
