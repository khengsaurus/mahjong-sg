import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CheckBox from 'platform/components/Form';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow, MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useState } from 'react';
import { HandPoint } from 'shared/handEnums';
import { IDeclareHuModalProps, IPoint } from 'shared/typesPlus';
import { generateNumberArray, getHandDesc } from 'shared/util';

const DeclareHuModal = ({ show, game, playerSeat, HH, onClose, callback }: IDeclareHuModalProps) => {
	const { px = [HandPoint.MIN, HandPoint.MAX] } = game || {};
	const [tai, setTai] = useState(Math.min(HH?.maxPx, px[1]) || 0);
	const [zimo, setZimo] = useState(!!HH?.self);

	async function hu() {
		callback();
		game.declareHu([playerSeat, Math.min(tai, px[1]), Number(zimo), ...(HH?.pxs || []).map(p => p.hD)]);
		game.endRound();
		ServiceInstance.updateGame(game);
		onClose(true);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	const renderManualHuOptions = () => (
		<div style={{ padding: '5px 0px' }}>
			<FormRow>
				<Title title="台: " variant="subtitle1" padding="0px 15px 0px 0px" />
				<RadioGroup row value={tai} onChange={handleSetTaiNumber} defaultValue={HH?.maxPx}>
					{generateNumberArray(px[1] || 5).map((tai: number) => (
						<FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />
					))}
				</RadioGroup>
			</FormRow>
			<CheckBox
				title="自摸: "
				value={zimo}
				onChange={() => {
					setZimo(prev => !prev);
				}}
				defaultChecked={!!HH?.self}
			/>
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
						variant="h6"
						padding="3px 0px"
					/>
					{HH?.pxs?.map((p: IPoint, ix: number) => {
						return <Title title={getHandDesc(p.hD)} variant="subtitle2" padding="2px" key={ix} />;
					})}
					{game?.mHu ? (
						renderManualHuOptions()
					) : (
						<Title
							title={`${tai} 台${HH?.self ? ` 自摸` : ``}`}
							variant="subtitle1"
							padding="3px 0px 6px"
						/>
					)}
					<StyledButton
						label={`胡`}
						size="large"
						onClick={hu}
						disabled={!tai || game?.hu.length > 2}
						style={{ position: 'absolute', bottom: 5, right: 0 }}
					/>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
