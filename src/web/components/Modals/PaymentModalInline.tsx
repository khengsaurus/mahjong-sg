import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { Amounts } from 'shared/enums';
import { Game } from 'shared/models2';
import { MuiStyles } from 'web/style/MuiStyles';
import { Row } from 'web/style/StyledComponents';
import { Title } from 'web/style/StyledMui';
import { sendChips } from './PaymentModal';

interface Props {
	game: Game;
	playerSeat: number;
}

const PaymentModalInline = (props: Props) => {
	const { game, playerSeat } = props;
	const winner = game.hu[0];
	const [amountStr, setAmountStr] = useState<string>('');
	const [amount, setAmount] = useState<number>(0);

	const handleSelectAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
		let selectedAmountStr = (event.target as HTMLInputElement).value;
		setAmountStr(selectedAmountStr);
		setAmount(Number(selectedAmountStr) || 0);
	};

	return (
		<Row>
			<Title variant="subtitle1" title={`Send chips:`} padding="3px" />
			<FormControl style={{ alignSelf: 'center' }}>
				<Select
					style={{ ...MuiStyles.dropdown_select }}
					value={amountStr}
					onChange={handleSelectAmount}
					label="Chips"
					IconComponent={() => null}
				>
					{Amounts.map(amount => {
						return (
							<MenuItem key={`amount-${amount}`} style={{ ...MuiStyles.dropdown_item }} value={amount}>
								{amount}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<IconButton
				style={{ marginLeft: '10px' }}
				onClick={() => {
					sendChips(game, playerSeat, winner, amount, () => {
						setAmountStr('');
					});
				}}
				disabled={!Number(amount)}
				size="small"
				disableRipple
			>
				<SendIcon />
			</IconButton>
		</Row>
	);
};

export default PaymentModalInline;
