import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	FormControlLabel,
	IconButton,
	TextField,
	ThemeProvider,
	Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { Game } from '../../Models/Game';
import * as firebaseService from '../../service/firebaseService';
import { rotatedMUI } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: () => void;
	show: boolean;
}

const HuDialog = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	const [taiString, setTaiString] = useState('');
	const [tai, setTai] = useState(0);
	const [zimo, setZimo] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	async function hu() {
		game.hu = [playerSeat, tai, zimo ? 1 : 0];
		game.flagProgress = Number(game.dealer) === playerSeat ? false : true;
		game.endRound();
		firebaseService.updateGame(game);
		onClose();
	}

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

	return (
		<div>
			<ThemeProvider theme={rotatedMUI}>
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={onClose}
					PaperProps={{
						style: {
							backgroundColor: 'rgb(220, 190, 150)'
						}
					}}
				>
					<DialogContent>
						<IconButton style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={onClose}>
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
								disabled={taiString.trim() === '' || !Number(taiString) || tai <= 0 || tai > 5}
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

export default HuDialog;
