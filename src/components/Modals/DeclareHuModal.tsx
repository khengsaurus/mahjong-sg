import {
	Dialog,
	DialogContent,
	FormControlLabel,
	Radio,
	RadioGroup
} from '@mui/material';
import { CheckBox } from 'components';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText, ScreenTextChi, ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { MuiStyles } from 'style/MuiStyles';
import { FormRow, MainTransparent } from 'style/StyledComponents';
import { StyledButton, StyledText } from 'style/StyledMui';
import { IDeclareHuModalP, IPoint } from 'typesPlus';
import { generateNumbers, getHandDesc } from 'utility';

const DeclareHuModal = ({
	show,
	game,
	playerSeat,
	HH,
	handleHu,
	onClose
}: IDeclareHuModalP) => {
	const { f = [], hu, n = [] } = game || {};
	const {
		theme: { enOnly = false }
	} = useSelector((state: IStore) => state);
	const defaultZimo =
		!!HH?.self || (f[3] && n[3] === playerSeat && !isEmpty(game.ps[playerSeat]?.lTa));
	const [zimo, setZimo] = useState(defaultZimo);
	const [tai, setTai] = useState(Math.min(HH?.maxPx, n[9]) || 0);

	async function declareHu() {
		handleHu(game, playerSeat, HH, tai, zimo);
		onClose(true);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	const renderManualHuOptions = () => (
		<div>
			<FormRow>
				<StyledText
					text={enOnly ? ScreenTextEng.TAI : ScreenTextChi.TAI}
					variant="subtitle2"
					padding="0px"
				/>
				<RadioGroup
					row
					value={tai}
					onChange={handleSetTaiNumber}
					defaultValue={HH?.maxPx}
				>
					{generateNumbers(n[8], n[9]).map((tai: number) => (
						<FormControlLabel
							key={tai}
							value={tai}
							control={<Radio />}
							label={tai}
						/>
					))}
				</RadioGroup>
			</FormRow>
			<FormRow style={{ height: 30 }}>
				<StyledText
					text={enOnly ? ScreenTextEng.SELF_DRAWN : ScreenTextChi.SELF_DRAWN}
					variant="subtitle2"
					padding="0px"
				/>
				<CheckBox
					title=""
					value={zimo}
					onChange={() => setZimo(prev => !prev)}
					defaultChecked={defaultZimo}
				/>
			</FormRow>
		</div>
	);

	return (
		<MainTransparent>
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={() => onClose(false)}
				PaperProps={{
					style: MuiStyles.medium_dialog
				}}
			>
				<DialogContent style={{ paddingBottom: '10px' }}>
					<StyledText
						text={
							HH?.maxPx === n[9]
								? ScreenTextEng.NICE_HAND
								: ScreenTextEng.READY_TO_HU
						}
						variant="subtitle1"
						padding="0px"
					/>
					{HH?.pxs?.map((p: IPoint, ix: number) => (
						<StyledText
							key={ix}
							text={getHandDesc(p.hD, enOnly)}
							variant="subtitle2"
							padding="0px"
						/>
					))}
					{/* <StyledText text={`${tai} 台${zimo ? ` 自摸` : ``}`} variant="subtitle2" padding="2px 0px" /> */}
					{renderManualHuOptions()}
					<StyledButton
						label={ButtonText.HU}
						size="large"
						onClick={declareHu}
						disabled={!tai || tai < n[8] || hu.length > 2}
						style={{ position: 'absolute', bottom: 2, right: 5 }}
					/>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
