import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	ThemeProvider,
	Typography
} from '@material-ui/core';
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
	const [recipientIndex, setRecipientIndex] = useState<number>(null);
	const [amount, setAmount] = useState(0);

	const amounts = [0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4];

	async function pay() {
		game.players[playerSeat].balance -= amount;
		game.players[recipientIndex].balance += amount;
		game.newLog(`${game.players[playerSeat].username} sent ${game.players[recipientIndex].username} $${amount}`);
		FBService.updateGame(game);
		setAmount(0);
		setTimeout(function () {
			onClose();
		}, 1000);
	}

	const handleSelectRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRecipientIndex(parseInt((event.target as HTMLInputElement).value));
	};

	const handleSelectAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number((event.target as HTMLInputElement).value));
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
							maxWidth: '400px',
							minWidth: '400px',
							maxHeight: '300px',
							minHeight: '300px',
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
						<br></br>
						<FormControl component="fieldset">
							<FormLabel component="legend">{`To: `}</FormLabel>
							<RadioGroup row value={recipientIndex} onChange={handleSelectRecipient}>
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
						<br></br>
						<FormControl component="fieldset">
							<FormLabel component="legend">{`Amount: `}</FormLabel>
							<RadioGroup row value={amount} onChange={handleSelectAmount}>
								{amounts.map((amount: number, index: number) => {
									return (
										<FormControlLabel
											key={index}
											value={amount}
											control={<Radio color="primary" />}
											label={`$${amount}`}
											labelPlacement="end"
										/>
									);
								})}
							</RadioGroup>
						</FormControl>
						<br></br>
						<DialogActions>
							<Button
								variant="outlined"
								size="small"
								onClick={pay}
								disabled={!recipientIndex || !amount}
								autoFocus
							>
								{`Send`}
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default PaymentWindow;
