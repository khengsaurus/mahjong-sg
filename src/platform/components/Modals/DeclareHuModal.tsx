import { Dialog, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { isEmpty } from 'lodash';
import CheckBox from 'platform/components/Form';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow, MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { HandPoint } from 'shared/handEnums';
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
				<StyledText title="台: " variant="subtitle2" padding="0px" />
				<RadioGroup row value={tai} onChange={handleSetTaiNumber} defaultValue={HH?.maxPx}>
					{generateNumbers(px[0], px[1]).map((tai: number) => (
						<FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />
					))}
				</RadioGroup>
			</FormRow>
			<FormRow>
				<StyledText title="自摸: " variant="subtitle2" padding="0px" />
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
						title={HH?.maxPx === px[1] ? `Wow, nice hand!` : `Ready to hu?`}
						variant="subtitle1"
						padding="3px 0px"
					/>
					{HH?.pxs?.map((p: IPoint, ix: number) => {
						return <StyledText title={getHandDesc(p.hD)} variant="subtitle2" padding="2px" key={ix} />;
					})}
					{game?.mHu ? (
						renderManualHuOptions()
					) : (
						<StyledText
							title={`${tai} 台${HH?.self ? ` 自摸` : ``}`}
							variant="subtitle2"
							padding="3px 0px"
						/>
					)}
					<StyledButton
						label={`Hu`}
						size="large"
						onClick={hu}
						disabled={!tai || tai < game?.px[0] || game?.hu.length > 2}
						style={{ position: 'absolute', bottom: 10, right: 0 }}
					/>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
