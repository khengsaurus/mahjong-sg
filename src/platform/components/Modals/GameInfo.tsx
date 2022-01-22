import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, FormControl, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { BotTimeout, LocalFlag } from 'shared/enums';
import { HandDescEng, ScoringHand } from 'shared/handEnums';
import { ButtonText, PaymentLabel } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { ModalProps } from 'shared/typesPlus';
import './gameInfo.scss';

const padding0Height35 = {
	padding: 0,
	height: 35,
	width: 180
};

const renderSetting = (label: string, toggle: boolean) => (
	<ListItem style={{ ...padding0Height35, width: 167 }}>
		<ListItemText primary={label} />
		{toggle ? <CheckIcon fontSize={'small'} /> : <CloseIcon fontSize={'small'} />}
	</ListItem>
);

const GameInfo = ({ game, show, onClose }: ModalProps) => {
	const { user } = useSelector((store: IStore) => store);
	const [mHu, setMHu] = useState<boolean>(game?.mHu);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(game?.bt));
	const [bt, setBt] = useState<number>(game?.bt);

	function getSpeedLabel(timeout: number) {
		switch (timeout) {
			case BotTimeout.FAST:
				return 'Fast';
			case BotTimeout.MEDIUM:
				return 'Medium';
			case BotTimeout.SLOW:
				return 'Slow';
			default:
				return '';
		}
	}

	const closeAndUpdate = useCallback(() => {
		if (game?.mHu !== mHu || game?.bt !== bt) {
			ServiceInstance.adminUpdateGame(game, game.id === LocalFlag, mHu, bt);
		}
		onClose();
	}, [game, mHu, bt, onClose]);

	const renderManualHuSelect = () => (
		<ListItem style={{ ...padding0Height35 }}>
			<ListItemText primary={ButtonText.MANUAL_HU} />
			<Row style={{ marginRight: -5 }}>
				<Switch checked={mHu} onChange={() => setMHu(prev => !prev)} />
			</Row>
		</ListItem>
	);

	const renderBotTimeSelect = () => {
		function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
			const speed = (event.target as HTMLInputElement).value;
			setBtLabel(speed);
			setBt(BotTimeout[speed.toUpperCase()]);
		}

		return (
			<ListItem style={{ ...padding0Height35, justifyContent: 'space-between' }}>
				<ListItemText primary={ButtonText.BOT_SPEED} style={{ textAlign: 'left', width: 100 }} />
				<Select
					value={btLabel}
					onChange={handleChange}
					disableUnderline
					variant="standard"
					IconComponent={() => null}
					style={{ position: 'absolute', right: -20, width: 90 }}
				>
					{['Slow', 'Medium', 'Fast'].map(t => (
						<MenuItem key={`bt-${t}`} style={{ ...MuiStyles.small_dropdown_item }} value={t}>
							{t}
						</MenuItem>
					))}
				</Select>
			</ListItem>
		);
	};

	return (
		<Dialog open={show} BackdropProps={{ invisible: true }} onClose={closeAndUpdate}>
			<DialogContent style={{ padding: '10 15 !important' }}>
				{user?.uN === game.cO && (
					<FormControl component="fieldset">
						{renderManualHuSelect()}
						{renderBotTimeSelect()}
					</FormControl>
				)}
				<Row className={`${game.pay}`}>
					<StyledText text={`${PaymentLabel.LABEL}`} variant="body1" />
					<StyledText text={`${PaymentLabel[game.pay]}`} variant="body1" />
				</Row>
				<Row className={`tai`}>
					<StyledText text={`${ButtonText.MINMAXTAI}`} variant="body1" />
					<StyledText text={`${game.px.join(' / ')}`} variant="body1" />
				</Row>
				{renderSetting(HandDescEng.CONCEALED, game.sHs.includes(ScoringHand.CONCEALED) ? false : true)}
				{renderSetting(HandDescEng.SEVEN, game.sHs.includes(ScoringHand.SEVEN) ? false : true)}
				{renderSetting(HandDescEng.GREEN, game.sHs.includes(ScoringHand.GREEN) ? false : true)}
			</DialogContent>
		</Dialog>
	);
};

export default GameInfo;

/* -------------------- {isDev() && game.id !== LocalFlag && <Scenarios />} -------------------- */

// interface IGameStateOption {
// 	label: string;
// 	obj: Object;
// }

// const Scenarios = () => {
// 	const gameStateOptions: IGameStateOption[] = [
// 		// { label: 'User3 Hu', obj: sample_user3_hu },
// 	];

// 	return (
// 		<>
// 			{gameStateOptions.map((o, ix) => (
// 				<StyledButton key={ix} label={o.label} onClick={() => ServiceInstance.setGame(objToGame(o.obj))} />
// 			))}
// 		</>
// 	);
// };
