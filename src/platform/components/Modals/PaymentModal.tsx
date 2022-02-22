import { Button, Dialog, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Amounts, LocalFlag } from 'shared/enums';
import { Game, User } from 'shared/models';
import { ButtonText, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { IModalP } from 'shared/typesPlus';
import './paymentModal.scss';

export async function sendChips(game: Game, from: number, to: number, amt: number, sendCallback?: () => void) {
	ServiceInstance.sendPayment(game, game.id === LocalFlag, from, to, amt);
	sendCallback && sendCallback();
}

const PaymentModal = ({ playerSeat, show, onClose }: IModalP) => {
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const [toWho, setToWho] = useState(10);
	const [amt, setAmt] = useState(0);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const { ps } = currGame;
	const playerUsername = ps[playerSeat].uN;

	function sendCallback() {
		setToWho(10);
		setAmt(0);
		onClose();
	}

	function renderChips() {
		return (
			<div className="chips">
				{ps.map((p: User, ix: number) => (
					<div className="item" key={`pay-user-${ix}`}>
						<StyledText key={ix} text={`${p.uN}: ${p.bal}`} variant="subtitle1" padding="0px" />
					</div>
				))}
			</div>
		);
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
					...MuiStyles.medium_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: '10px' }}>
				<StyledText text={`${ScreenTextEng.CHIPS_DIST}:`} variant="subtitle1" padding="0px" />
				{renderChips()}
				<StyledText text={`${ScreenTextEng.SEND_CHIPS_TO}: `} variant="subtitle1" padding="10px 0px 0px" />
				<RadioGroup
					row
					value={toWho}
					onChange={handleSelectRecipient}
					style={{ height: 32, alignContent: 'center' }}
				>
					{ps.map((otherPlayer: User, index: number) =>
						otherPlayer.uN !== playerUsername ? (
							<FormControlLabel
								key={otherPlayer.uN}
								value={index}
								control={<Radio style={{ height: '32px', width: '32px' }} disableRipple />}
								style={{ width: '110px' }}
								label={otherPlayer.uN}
							/>
						) : null
					)}
				</RadioGroup>

				<StyledText text={`${ButtonText.AMOUNT}:`} variant="subtitle1" padding="10px 0px 0px" />
				<RadioGroup
					row
					value={amt}
					onChange={handleSelectAmount}
					style={{ height: 64, alignContent: 'center', width: 300 }}
				>
					{Amounts.map(
						(amt: number, index: number) =>
							amt > 0 && (
								<FormControlLabel
									key={index}
									label={amt}
									value={amt}
									control={<Radio style={{ height: '32px', width: '32px' }} disableRipple />}
									style={{ width: '60px' }}
									labelPlacement="end"
								/>
							)
					)}
				</RadioGroup>

				<Button
					style={{ position: 'absolute', bottom: 7, right: 5 }}
					variant="text"
					size="medium"
					onClick={() => sendChips(currGame, playerSeat, toWho, amt, sendCallback)}
					disabled={toWho === 9 || !amt || amt <= 0}
					disableRipple
				>
					{ButtonText.SEND}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentModal;
