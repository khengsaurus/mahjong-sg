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
import { useContext, useState } from 'react';
import { Amounts } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
import { MainTransparent } from '../../global/StyledComponents';
import { Game } from '../../Models/Game';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: () => void;
	show: boolean;
}

const PaymentModal = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	const { tableColor, tableTextColor } = useContext(AppContext);
	const [recipientIndex, setRecipientIndex] = useState(10);
	const [amount, setAmount] = useState(0);
	let playerUsername = game.players[playerSeat].username;

	async function pay() {
		game.players[playerSeat].balance = Math.round(game.players[playerSeat].balance - amount);
		game.players[recipientIndex].balance = Math.round(game.players[recipientIndex].balance + amount);
		game.newLog(
			`${game.players[playerSeat].username} sent ${game.players[recipientIndex].username} ${amount} chips`
		);
		FBService.updateGame(game);
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
						style={{ color: tableTextColor, position: 'absolute', top: 5, right: 5 }}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6">{'Send chips'}</Typography>
					<FormControl component="fieldset">
						<Typography variant="subtitle1">{'To: '}</Typography>
						<RadioGroup row value={recipientIndex} onChange={handleSelectRecipient}>
							{game.players.map((otherPlayer: User, index: number) => {
								return otherPlayer.username !== playerUsername ? (
									<FormControlLabel
										key={otherPlayer.username}
										value={index}
										control={<Radio style={{ color: tableTextColor }} />}
										label={otherPlayer.username}
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
										control={<Radio style={{ color: tableTextColor }} />}
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
							style={{ color: tableTextColor, position: 'absolute', bottom: 15, right: 15 }}
							variant="text"
							size="large"
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

export default PaymentModal;
