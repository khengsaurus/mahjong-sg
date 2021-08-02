import {
	Dialog,
	DialogContent,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Radio,
	RadioGroup,
	TextField,
	ThemeProvider,
	Typography
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { rotatedMUIDialog } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: () => void;
	show: boolean;
}

const PaymentWindow = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	let playerUsername = game.players[playerSeat].username;
	const [recipientIndex, setRecipientIndex] = useState(0);
	const [amountString, setAmountString] = useState('');
	const [amount, setAmount] = useState(0);
	const [errorMsg, setErrorMsg] = useState('');

	async function pay() {
		game.players[playerSeat].balance -= amount;
		game.players[recipientIndex].balance += amount;
		game.newLog(`${game.players[playerSeat].username} paid ${game.players[recipientIndex].username} $${amount}`);
		FBService.updateGame(game);
		setAmountString('');
		setAmount(0);
		setTimeout(function () {
			onClose();
		}, 1000);
	}

	function handleSetAmount(amount: string) {
		setAmountString(amount);
		if (amount.trim() === '') {
			setErrorMsg('');
		} else if (!Number(amount) || Number(amount) <= 0) {
			setErrorMsg('Enter a valid amount');
		} else {
			setErrorMsg('');
			setAmount(Math.round(Number(amount) * 100) / 100);
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRecipientIndex(parseInt((event.target as HTMLInputElement).value));
	};

	return (
		<div className="main transparent">
			<ThemeProvider theme={rotatedMUIDialog}>
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
						<IconButton
							style={{ color: 'black', position: 'absolute', top: '12px', right: '15px' }}
							onClick={onClose}
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="subtitle1">{'Send money'}</Typography>
						<FormControl component="fieldset">
							<RadioGroup aria-label="gender" name="To:" value={recipientIndex} onChange={handleChange}>
								{game.players.map((otherPlayer: User, index: number) => {
									return otherPlayer.username !== playerUsername ? (
										<FormControlLabel
											key={otherPlayer.username}
											value={index}
											control={<Radio color="primary" />}
											label={otherPlayer.username}
										/>
									) : null;
								})}
							</RadioGroup>
						</FormControl>
						<br></br>
						<TextField
							label="Amount"
							error={errorMsg !== '' && amountString.trim() !== ''}
							helperText={errorMsg}
							value={amountString}
							onChange={e => {
								handleSetAmount(e.target.value);
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											color="primary"
											component="span"
											size="small"
											onClick={pay}
											disabled={
												amountString.trim() === '' || !Number(amountString) || amount <= 0
											}
										>
											<ChevronRightIcon />
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
						{/* <br></br>
						<DialogActions>
							<Button
								variant="outlined"
								size="small"
								onClick={pay}
								disabled={amountString.trim() === '' || !Number(amountString) || amount <= 0}
								autoFocus
							>
								Send
							</Button>
						</DialogActions> */}
					</DialogContent>
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default PaymentWindow;
