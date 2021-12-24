import SendIcon from '@mui/icons-material/Send';
import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';
import { useState } from 'react';
import { Amounts } from 'shared/enums';
import { Game } from 'shared/models';
import { sendChips } from './PaymentModal';

interface IPaymentModalInline {
	game: Game;
	playerSeat: number;
	updateGame: (game: Game) => void;
}

const PaymentModalInline = ({ game, playerSeat, updateGame }: IPaymentModalInline) => {
	const winner = game.hu[0];
	const [amountStr, setAmountStr] = useState<string>('');
	const [amount, setAmount] = useState<number>(2 ** game.hu[1] * (game.thB === playerSeat ? 2 : 1) || 0);

	const handleSelectAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
		let selectedAmountStr = (event.target as HTMLInputElement).value;
		setAmountStr(selectedAmountStr);
		setAmount(Number(selectedAmountStr) || 0);
	};

	return (
		<FormRow style={{ paddingTop: '2px' }}>
			<Title variant="subtitle1" title={`Send chips:`} padding="2px" />
			<FormControl>
				<Select
					value={amountStr}
					onChange={handleSelectAmount}
					label="Chips"
					variant="standard"
					IconComponent={() => null}
					style={{ ...MuiStyles.small_dropdown_select, marginLeft: '5px' }}
				>
					{Amounts.map(amount => (
						<MenuItem key={`amount-${amount}`} style={{ ...MuiStyles.small_dropdown_item }} value={amount}>
							{amount}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<IconButton
				style={{ marginLeft: '5px' }}
				onClick={() => {
					sendChips(game, playerSeat, winner, amount, updateGame, () => {
						setAmountStr('');
					});
				}}
				disabled={!Number(amount)}
				size="small"
				disableRipple
			>
				<SendIcon />
			</IconButton>
		</FormRow>
	);
};

export default PaymentModalInline;
