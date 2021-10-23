import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { Amounts } from 'shared/enums';
import { Game, User } from 'shared/models';
import FBService from 'shared/service/MyFirebaseService';
import { MainTransparent } from 'web/style/StyledComponents';

export async function sendChips(
	game: Game,
	sender: number,
	recipient: number,
	amount: number,
	sendCallback?: () => void
) {
	game.ps[sender].bal = Math.round(game.ps[sender].bal - amount);
	game.ps[recipient].bal = Math.round(game.ps[recipient].bal + amount);
	game.newLog(`${game.ps[sender].uN} sent ${game.ps[recipient].uN} ${amount} chips`);
	FBService.updateGame(game);
	sendCallback && sendCallback();
}

const PaymentModal = ({ game, playerSeat, show, onClose }: IModalProps) => {
	const [recipientIndex, setRecipientIndex] = useState(10);
	const [amount, setAmount] = useState(0);
	let playerUsername = game.ps[playerSeat].uN;
	function sendCallback() {
		setRecipientIndex(10);
		setAmount(0);
		onClose();
	}

	const handleSelectRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRecipientIndex(parseInt((event.target as HTMLInputElement).value));
	};

	const handleSelectAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number((event.target as HTMLInputElement).value));
	};

	return (
		<MainTransparent>
			<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose}>
				<DialogContent>
					<IconButton style={{ position: 'absolute', top: 5, right: 5 }} onClick={onClose} disableRipple>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6">{'Send chips'}</Typography>
					<FormControl component="fieldset">
						<Typography variant="subtitle1">{'To: '}</Typography>
						<RadioGroup row value={recipientIndex} onChange={handleSelectRecipient}>
							{game.ps.map((otherPlayer: User, index: number) => {
								return otherPlayer.uN !== playerUsername ? (
									<FormControlLabel
										key={otherPlayer.uN}
										value={index}
										control={<Radio />}
										label={otherPlayer.uN}
									/>
								) : null;
							})}
						</RadioGroup>
					</FormControl>

					<FormControl component="fieldset">
						<Typography variant="subtitle1">{'Amount: '}</Typography>
						<RadioGroup row style={{ width: '90%' }} value={amount} onChange={handleSelectAmount}>
							{Amounts.map((amount: number, index: number) => {
								return (
									<FormControlLabel
										key={index}
										value={amount}
										control={<Radio />}
										label={`${amount}`}
										labelPlacement="end"
										style={{ width: '60px' }}
									/>
								);
							})}
						</RadioGroup>
					</FormControl>

					<DialogActions>
						<Button
							style={{ position: 'absolute', bottom: 15, right: 15 }}
							variant="text"
							size="large"
							onClick={() => {
								sendChips(game, playerSeat, recipientIndex, amount, sendCallback);
							}}
							disabled={recipientIndex === 10 || !amount || amount <= 0}
							disableRipple
						>
							{`Send`}
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default PaymentModal;
