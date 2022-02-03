import SendIcon from '@mui/icons-material/Send';
import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { isEmpty } from 'lodash';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useMemo, useState } from 'react';
import { Amounts, Size } from 'shared/enums';
import { Game } from 'shared/models';
import { ScreenTextEng } from 'shared/screenTexts';
import { getDefaultAmt } from 'shared/util';
import { sendChips } from './PaymentModal';

interface PaymentModalInlineProps {
	game: Game;
	playerSeat: number;
}

const PaymentModalInline = ({ game, playerSeat }: PaymentModalInlineProps) => {
	const { hu, n = [], pay } = game;

	const { winner, defaultAmt } = useMemo(() => {
		return {
			winner: isEmpty(hu) ? null : Number(hu[0]),
			defaultAmt: getDefaultAmt(hu, pay, playerSeat, n[7])
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(hu), pay, playerSeat, n[7]]);

	const [amountStr, setAmountStr] = useState<string>(`${defaultAmt}`);
	const [amount, setAmount] = useState(defaultAmt);

	function handleSelectAmount(event: React.ChangeEvent<HTMLInputElement>) {
		let selectedAmountStr = (event.target as HTMLInputElement).value;
		setAmountStr(selectedAmountStr);
		setAmount(Number(selectedAmountStr) || 0);
	}

	return (
		<FormRow style={{ margin: '0px 0px 2px', placeSelf: 'center' }}>
			<StyledText variant="body2" text={`${ScreenTextEng.SEND}:`} />
			<FormControl>
				<Select
					value={amountStr}
					onChange={handleSelectAmount}
					label={ScreenTextEng.CHIPS}
					variant="standard"
					IconComponent={() => null}
					style={{ ...MuiStyles.small_dropdown_select, marginLeft: '5px' }}
				>
					{Amounts.map(
						amount =>
							amount > 0 && (
								<MenuItem
									key={`amount-${amount}`}
									style={{ ...MuiStyles.small_dropdown_item }}
									value={amount}
								>
									{amount}
								</MenuItem>
							)
					)}
				</Select>
			</FormControl>
			<IconButton
				style={{ margin: '0px -8px 0px 5px' }}
				onClick={() => {
					sendChips(game, playerSeat, winner, amount, () => {
						setAmount(0);
						setAmountStr('');
					});
				}}
				disabled={!Number(amount)}
				size="small"
				disableRipple
			>
				<SendIcon fontSize={Size.SMALL} />
			</IconButton>
		</FormRow>
	);
};

export default PaymentModalInline;
