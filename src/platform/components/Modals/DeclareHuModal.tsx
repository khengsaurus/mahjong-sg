import { Dialog, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { isEmpty } from 'lodash';
import CheckBox from 'platform/components/Form';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow, MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { HandPoint } from 'shared/handEnums';
import { ButtonText, ScreenTextEng } from 'shared/screenTexts';
import { DeclareHuModalProps, IPoint } from 'shared/typesPlus';
import { generateNumbers, getHandDesc } from 'shared/util';

const DeclareHuModal = ({ show, game, playerSeat, HH, handleHu, onClose }: DeclareHuModalProps) => {
	const { px = [HandPoint.MIN, HandPoint.MAX] } = game || {};
	const defaultZimo = !!HH?.self || (game?.ta && game?.wM === playerSeat && !isEmpty(game.ps[playerSeat]?.lTa));
	const [zimo, setZimo] = useState(defaultZimo);
	const [tai, setTai] = useState(Math.min(HH?.maxPx, px[1]) || 0);

	async function hu() {
		handleHu(game, playerSeat, HH, tai, zimo);
		onClose(true);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	const renderManualHuOptions = () => (
		<div>
			<FormRow>
				<StyledText text="台: " variant="subtitle2" padding="0px" />
				<RadioGroup row value={tai} onChange={handleSetTaiNumber} defaultValue={HH?.maxPx}>
					{generateNumbers(px[0], px[1]).map((tai: number) => (
						<FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />
					))}
				</RadioGroup>
			</FormRow>
			<FormRow style={{ height: 30 }}>
				<StyledText text="自摸: " variant="subtitle2" padding="0px" />
				<CheckBox
					title=""
					value={zimo}
					onChange={() => {
						setZimo(prev => !prev);
					}}
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
					style: {
						...MuiStyles.medium_dialog
					}
				}}
			>
				<DialogContent>
					<StyledText
						text={HH?.maxPx === px[1] ? ScreenTextEng.NICE_HAND : ScreenTextEng.READY_TO_HU}
						variant="subtitle1"
						padding="3px 0px"
					/>
					{HH?.pxs?.map((p: IPoint, ix: number) => (
						<StyledText key={ix} text={getHandDesc(p.hD)} variant="subtitle2" padding="2px 0px" />
					))}
					<StyledText text={`${tai} 台${zimo ? ` 自摸` : ``}`} variant="subtitle2" padding="2px 0px" />
					{renderManualHuOptions()}
					<StyledButton
						label={ButtonText.HU}
						size="large"
						onClick={hu}
						disabled={!tai || tai < game?.px[0] || game?.hu.length > 2}
						style={{ position: 'absolute', bottom: 0, right: 5 }}
					/>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
