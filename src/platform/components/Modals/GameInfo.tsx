import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, Divider, ListItem, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered, Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { BotTimeout, LocalFlag, PaymentType } from 'shared/enums';
import { HandDescEng, ScoringHand } from 'shared/handEnums';
import { AppContext } from 'shared/hooks';
import { PaymentLabel, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { IModalP } from 'shared/typesPlus';
import { isBot } from 'shared/util';
import './gameInfo.scss';

const padding0Height32 = {
	padding: 0,
	height: 32,
	width: 200,
	justifyContent: 'space-between'
};

const renderSwitch = (label: string, checked: boolean, handleChange: () => void, rightWidth: number) => (
	<ListItem style={{ ...padding0Height32 }}>
		<StyledText text={label} variant="body2" />
		<Centered style={{ width: rightWidth }}>
			<Switch checked={checked} onChange={handleChange} />
		</Centered>
	</ListItem>
);

const renderSettingValue = (label: string, value: string, rightWidth: number) => (
	<Row className="setting">
		<StyledText text={label} variant="body2" />
		<Centered style={{ width: rightWidth }}>
			<StyledText text={value} variant="body2" />
		</Centered>
	</Row>
);

const renderSettingCheck = (label: string, toggle: boolean, rightWidth: number) => (
	<ListItem style={{ ...padding0Height32 }}>
		<StyledText text={label} variant="body2" />
		<Centered style={{ width: rightWidth }}>
			{toggle ? <CheckIcon fontSize={'small'} /> : <CloseIcon fontSize={'small'} />}
		</Centered>
	</ListItem>
);

const renderBotTimeSelect = (
	label: string,
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	rightWidth: number
) => {
	return (
		<ListItem style={{ ...padding0Height32 }}>
			<StyledText text={ScreenTextEng.BOT_SPEED} variant="body2" />
			<Centered style={{ width: rightWidth }}>
				<Select
					value={label}
					onChange={handleChange}
					disableUnderline
					variant="standard"
					IconComponent={() => null}
					style={{ fontSize: 14 }}
				>
					{['Fast', 'Medium', 'Slow'].map(t => (
						<MenuItem key={`bt-${t}`} style={{ ...MuiStyles.small_dropdown_item }} value={t}>
							{t}
						</MenuItem>
					))}
				</Select>
			</Centered>
		</ListItem>
	);
};

const GameInfo = ({ game, show, onClose }: IModalP) => {
	const { cO, id: gameId, f = [], n = [], pay, ps, sHs } = game;
	const { hasAI, showAI, setShowAI } = useContext(AppContext);
	const { user } = useSelector((store: IStore) => store);
	const [manualHu, setManualHu] = useState<boolean>(f[6]);
	const [easyAI, setEasyAI] = useState<boolean>(f[8]);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(n[10]));
	const [botSpeed, setBotSpeed] = useState<number>(n[10]);
	const rightWidth = pay === PaymentType.HALF_SHOOTER ? 75 : 60;

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

	const closeAndUpdate = () => {
		if (f[6] !== manualHu || n[10] !== botSpeed || f[8] !== easyAI) {
			ServiceInstance.adminUpdateGame(game, gameId === LocalFlag, manualHu, botSpeed, easyAI);
		}
		onClose();
	};

	function handleBotTimeSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const speed = (event.target as HTMLInputElement).value;
		setBtLabel(speed);
		setBotSpeed(BotTimeout[speed.toUpperCase()]);
	}

	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			onClose={closeAndUpdate}
			PaperProps={{
				style: {
					...MuiStyles.medium_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: '10px' }}>
				{renderSettingValue(`${PaymentLabel.LABEL}`, `${PaymentLabel[pay]}`, rightWidth)}
				{renderSettingValue(`${ScreenTextEng.MINMAXTAI}`, `${n[8]} / ${n[9]}`, rightWidth)}
				{renderSettingCheck(
					HandDescEng.CONCEALED,
					sHs.includes(ScoringHand.CONCEALED) ? false : true,
					rightWidth
				)}
				{renderSettingCheck(HandDescEng.SEVEN, sHs.includes(ScoringHand.SEVEN) ? false : true, rightWidth)}
				{renderSettingCheck(HandDescEng.GREEN, sHs.includes(ScoringHand.GREEN) ? false : true, rightWidth)}
				{(user?.uN === cO || gameId === LocalFlag) && <Divider />}
				{user?.uN === cO &&
					renderSwitch(ScreenTextEng.MANUAL_HU, manualHu, () => setManualHu(prev => !prev), rightWidth)}
				{gameId === LocalFlag &&
					renderSwitch(ScreenTextEng.SHOW_BOT_HANDS, showAI, () => setShowAI(!showAI), rightWidth)}
				{user?.uN === cO &&
					hasAI &&
					renderSwitch(ScreenTextEng.EASY_AI, easyAI, () => setEasyAI(!easyAI), rightWidth)}
				{user?.uN === cO &&
					!!ps.find(p => isBot(p.id)) &&
					renderBotTimeSelect(btLabel, handleBotTimeSelect, rightWidth)}
			</DialogContent>
		</Dialog>
	);
};

export default GameInfo;

/* -------------------- {isDev() && gameId !== LocalFlag && <Scenarios />} -------------------- */

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
