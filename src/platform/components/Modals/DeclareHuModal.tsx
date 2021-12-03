import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import CheckBox from 'platform/components/Form';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow, MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useState } from 'react';
import { generateNumberArray, getHandDesc } from 'shared/util';

const DeclareHuModal = ({ game, playerSeat, show, onClose, HH }: IDeclareHuModal) => {
	const [tai, setTai] = useState(HH?.maxPx || 0);
	const [zimo, setZimo] = useState(!!HH?.self);

	async function hu() {
		onClose(true);
		game.hu = [playerSeat, tai, Number(zimo), ...(HH?.pxs || []).map(p => p.hD)];
		game.fN = Number(game?.dealer) !== playerSeat;
		game.endRound();
		FBService.updateGame(game);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	const renderManualHuOptions = () => (
		<div style={{ padding: '5px 0px' }}>
			<FormRow>
				<Title title="台: " variant="subtitle1" padding="0px 15px 0px 0px" />
				<RadioGroup row value={tai} onChange={handleSetTaiNumber} defaultValue={HH?.maxPx}>
					{generateNumberArray(game?.gMaxPx || 5).map((tai: number) => (
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
						...MuiStyles.small_dialog
					}
				}}
			>
				<DialogContent>
					<IconButton
						style={{ position: 'absolute', top: 5, right: 8 }}
						onClick={() => onClose(false)}
						disableRipple
					>
						<CloseIcon />
					</IconButton>
					<Title
						title={HH?.maxPx === game?.gMaxPx ? `Wow, nice hand!` : `Ready to hu?`}
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
							title={`${HH?.maxPx} 台${HH?.self ? ` 自摸` : ``}`}
							variant="subtitle1"
							padding="3px 0px"
						/>
					)}
					<StyledButton
						label={`胡`}
						size="large"
						onClick={hu}
						disabled={!tai || game?.hu.length === 3}
						style={{ position: 'absolute', bottom: 5, right: 0 }}
					/>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
