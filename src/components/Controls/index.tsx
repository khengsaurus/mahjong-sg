import {
	Typography,
	Button,
	Checkbox,
	createTheme,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	TextField,
	ThemeProvider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
	const { playerSeat } = props;
	const { selectedTiles, setSelectedTiles } = useContext(AppContext);
	const [meld, setMeld] = useState<Tile[]>([]);
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [showHuDialog, setShowHuDialog] = useState(false);
	const [taiString, setTaiString] = useState('');
	const [tai, setTai] = useState(null);
	const [zimo, setZimo] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

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

	/* -------------------- Start Hu -------------------- */
	function declareHu() {
		setShowHuDialog(true);
		// show all tiles
	}

	async function hu() {
		game.hu = [tai, zimo ? 1 : 0];
		game.flagProgress = game.whoseMove === playerSeat ? false : true;
		game.endRound();
		// announcement dialog
		// pay ??
		// await game.endRound().then((continueGame: boolean) => {
		// 	if (continueGame) {
		// 		// display wind & round
		// 	} else {
		// 		// display game has ended
		// 	}
		// });
	}

	const renderHuDialog = () => {
		function handleSetTai(tai: string) {
			setTaiString(tai);
			if (tai.trim() === '') {
				setErrorMsg('');
			} else if (!Number(tai) || parseInt(tai) <= 0 || parseInt(tai) > 5) {
				setErrorMsg('Please enter 1-5');
			} else {
				setErrorMsg('');
				setTai(parseInt(tai));
			}
		}
		const theme = createTheme({
			overrides: {
				MuiDialog: {
					root: {
						transform: 'rotate(90deg)',
						display: 'flex',
						flexDirection: 'column'
					}
				}
			}
		});

		return (
			<div className="hu-dialog-container">
				<ThemeProvider theme={theme}>
					<Dialog
						open={showHuDialog}
						BackdropProps={{ invisible: true }}
						onClose={() => {
							setShowHuDialog(false);
						}}
						PaperProps={{
							style: {
								backgroundColor: 'rgb(220, 190, 150)'
							}
						}}
					>
						<DialogContent>
							<IconButton
								style={{ position: 'absolute', top: '20px', right: '20px' }}
								onClick={() => {
									setShowHuDialog(false);
								}}
							>
								<CloseIcon />
							</IconButton>
							<Typography variant="h6">{'Nice!'}</Typography>
							<TextField
								label="Tai"
								error={errorMsg !== '' && taiString.trim() !== ''}
								helperText={errorMsg}
								value={taiString}
								color="secondary"
								onChange={e => {
									handleSetTai(e.target.value);
								}}
							/>
							<br></br>
							<FormControlLabel
								label="自摸"
								control={
									<Checkbox
										// checked={}
										onChange={() => {
											setZimo(!zimo);
										}}
									/>
								}
							/>
							<DialogActions>
								<Button
									variant="outlined"
									onClick={hu}
									disabled={tai <= 0 || tai > 5 || !Number(taiString)}
									autoFocus
								>
									Hu
								</Button>
							</DialogActions>
						</DialogContent>
					</Dialog>
				</ThemeProvider>
			</div>
		);
	};
	/* -------------------- End Hu -------------------- */

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
					size="small"
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
				<Button className="button" variant="outlined" size="small" onClick={declareHu}>
					Hu
				</Button>
			</div>
			{showHuDialog && renderHuDialog()}
		</div>
	) : null;
};

export default Controls;
