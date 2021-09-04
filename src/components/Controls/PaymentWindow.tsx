import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useContext, useState } from 'react';
import { MainTransparent, MuiStyles } from '../../global/styles';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './ControlsSmall.scss';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: () => void;
	show: boolean;
}

const PaymentWindow = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	const { tableColor, textColor } = useContext(AppContext);
	let playerUsername = game.players[playerSeat].username;
	const [recipientIndex, setRecipientIndex] = useState(10);
	const [amount, setAmount] = useState(0);

	const amounts = [0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4, 12.8];

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
		<MainTransparent>
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={onClose}
				PaperProps={{
					style: {
						...MuiStyles.modal,
						backgroundColor: `${tableColor}`
					}
				}}
			>
				<DialogContent>
					<IconButton
						style={{ color: `${textColor}`, position: 'absolute', top: 5, right: 5 }}
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
							disabled={recipientIndex === 10 || !amount || amount <= 0}
							autoFocus
						>
							{`Send`}
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default PaymentWindow;
