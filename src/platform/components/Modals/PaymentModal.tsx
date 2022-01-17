import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Amounts, LocalFlag } from 'shared/enums';
import { Game, User } from 'shared/models';
import { IStore } from 'shared/store';
import { ModalProps } from 'shared/typesPlus';

export async function sendChips(game: Game, from: number, to: number, amt: number, sendCallback?: () => void) {
	ServiceInstance.sendPayment(game, game.id === LocalFlag, from, to, amt);
	sendCallback && sendCallback();
}

const PaymentModal = ({ playerSeat, show, updateGame, onClose }: ModalProps) => {
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const [toWho, setToWho] = useState(10);
	const [amt, setAmt] = useState(0);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const playerUsername = currGame.ps[playerSeat].uN;

	function sendCallback() {
		setToWho(10);
		setAmt(0);
		onClose();
	}

	const handleSelectRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToWho(parseInt((event.target as HTMLInputElement).value));
	};

	const handleSelectAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmt(Number((event.target as HTMLInputElement).value));
	};

	return (
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
			<DialogContent style={{ padding: '10px 15px' }}>
				<StyledText title="Send chips" variant="subtitle1" padding="3px 0px" />
				<StyledText title="To: " variant="subtitle1" padding="2px 0px" />
				<RadioGroup row value={toWho} onChange={handleSelectRecipient}>
					{currGame.ps.map((otherPlayer: User, index: number) =>
						otherPlayer.uN !== playerUsername ? (
							<FormControlLabel
								key={otherPlayer.uN}
								value={index}
								control={<Radio disableRipple />}
								label={otherPlayer.uN}
							/>
						) : null
					)}
				</RadioGroup>

				<StyledText title="Amount: " variant="subtitle1" padding="2px 0px" />
				<RadioGroup row style={{ width: '90%' }} value={amt} onChange={handleSelectAmount}>
					{Amounts.map((amt: number, index: number) => (
						<FormControlLabel
							key={index}
							value={amt}
							control={<Radio />}
							label={`${amt}`}
							labelPlacement="end"
							style={{ width: '60px' }}
						/>
					))}
				</RadioGroup>

				<DialogActions>
					<Button
						style={{ position: 'absolute', bottom: 2, right: 2 }}
						variant="text"
						size="large"
						onClick={() => {
							sendChips(currGame, playerSeat, toWho, amt, sendCallback);
						}}
						disabled={toWho === 9 || !amt || amt <= 0}
						disableRipple
					>
						{`Send`}
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentModal;
