import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Amounts, LocalFlag } from 'shared/enums';
import { Game, User } from 'shared/models';
import { IStore } from 'shared/store';
import { ModalProps } from 'shared/typesPlus';

export async function sendChips(
	game: Game,
	sender: number,
	recipient: number,
	amount: number,
	updateGame: (game: Game) => void,
	sendCallback?: () => void
) {
	game.ps[sender].bal = Math.round(game.ps[sender].bal - amount);
	game.ps[recipient].bal = Math.round(game.ps[recipient].bal + amount);
	game.newLog(`${game.ps[sender].uN} sent ${game.ps[recipient].uN} ${amount} chips`);
	updateGame(game);
	sendCallback && sendCallback();
}

const PaymentModal = ({ playerSeat, show, updateGame, onClose }: ModalProps) => {
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const [recipientIndex, setRecipientIndex] = useState(10);
	const [amount, setAmount] = useState(0);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const playerUsername = currGame.ps[playerSeat].uN;

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
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={onClose}
				PaperProps={{
					style: {
						...MuiStyles.large_dialog
					}
				}}
			>
				<DialogContent>
					<StyledText title="Send chips" variant="subtitle1" padding="3px 0px" />
					<StyledText title="To: " variant="subtitle1" padding="2px 0px" />
					<RadioGroup row value={recipientIndex} onChange={handleSelectRecipient}>
						{currGame.ps.map((otherPlayer: User, index: number) =>
							otherPlayer.uN !== playerUsername ? (
								<FormControlLabel
									key={otherPlayer.uN}
									value={index}
									control={<Radio disableRipple/>}
									label={otherPlayer.uN}
								/>
							) : null
						)}
					</RadioGroup>

					<StyledText title="Amount: " variant="subtitle1" padding="2px 0px" />
					<RadioGroup row style={{ width: '90%' }} value={amount} onChange={handleSelectAmount}>
						{Amounts.map((amount: number, index: number) => (
							<FormControlLabel
								key={index}
								value={amount}
								control={<Radio />}
								label={`${amount}`}
								labelPlacement="end"
								style={{ width: '60px' }}
							/>
						))}
					</RadioGroup>

					<DialogActions>
						<Button
							style={{ position: 'absolute', bottom: 15, right: 15 }}
							variant="text"
							size="large"
							onClick={() => {
								sendChips(currGame, playerSeat, recipientIndex, amount, updateGame, sendCallback);
							}}
							disabled={recipientIndex === 9 || !amount || amount <= 0}
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
