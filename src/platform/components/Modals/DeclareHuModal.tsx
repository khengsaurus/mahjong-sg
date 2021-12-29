import { Dialog, DialogContent, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import CheckBox from 'platform/components/Form';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow, MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useState } from 'react';
import { HandPoint } from 'shared/handEnums';
import { IDeclareHuModalProps, IPoint } from 'shared/typesPlus';
import { generateNumbers, getHandDesc } from 'shared/util';

const DeclareHuModal = ({ show, game, playerSeat, HH, handleHu, onClose }: IDeclareHuModalProps) => {
	const { px = [HandPoint.MIN, HandPoint.MAX] } = game || {};
	const [tai, setTai] = useState(Math.min(HH?.maxPx, px[1]) || 0);
	const [zimo, setZimo] = useState(!!HH?.self);

	async function hu() {
		handleHu(game, playerSeat, HH, tai, zimo);
		// game.declareHu([playerSeat, Math.min(tai, px[1]), Number(zimo), ...(HH?.pxs || []).map(p => p.hD)]);
		// game.sk = [];
		// game.dF = null;
		// game.endRound();
		// triggerHaptic(ImpactStyle.Heavy);
		// updateGame(game);
		onClose(true);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	const renderManualHuOptions = () => (
		<div>
			<FormRow>
				<Title title="台: " variant="subtitle2" padding="0px" />
				<RadioGroup row value={tai} onChange={handleSetTaiNumber} defaultValue={HH?.maxPx}>
					{generateNumbers(px[0], px[1]).map((tai: number) => (
						<FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />
					))}
				</RadioGroup>
			</FormRow>
			<FormRow>
				<Title title="自摸: " variant="subtitle2" padding="0px" />
				<CheckBox
					title=""
					value={zimo}
					onChange={() => {
						setZimo(prev => !prev);
					}}
					defaultChecked={!!HH?.self}
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
					<Title
						title={HH?.maxPx === px[1] ? `Wow, nice hand!` : `Ready to hu?`}
						variant="subtitle1"
						padding="3px 0px"
					/>
					{HH?.pxs?.map((p: IPoint, ix: number) => {
						return <Title title={getHandDesc(p.hD)} variant="subtitle2" padding="2px" key={ix} />;
					})}
					{game?.mHu ? (
						renderManualHuOptions()
					) : (
						<Title title={`${tai} 台${HH?.self ? ` 自摸` : ``}`} variant="subtitle2" padding="3px 0px" />
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
