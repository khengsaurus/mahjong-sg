import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, ListItem, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered, Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { BotIds, BotTimeout, LocalFlag, PaymentType } from 'shared/enums';
import { HandDescEng, ScoringHand } from 'shared/handEnums';
import { AppContext } from 'shared/hooks';
import { ButtonText, PaymentLabel } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { ModalProps } from 'shared/typesPlus';
import './gameInfo.scss';

const padding0Height35 = {
	padding: 0,
	height: 32,
	width: 200,
	justifyContent: 'space-between'
};

const renderSwitch = (label: string, checked: boolean, handleChange: () => void, rightWidth: number) => (
	<ListItem style={{ ...padding0Height35 }}>
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
	<ListItem style={{ ...padding0Height35, height: 32 }}>
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
		<ListItem style={{ ...padding0Height35 }}>
			<StyledText text={ButtonText.BOT_SPEED} variant="body2" />
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

const GameInfo = ({ game, show, onClose }: ModalProps) => {
	const { revealBot, setRevealBot } = useContext(AppContext);
	const { user } = useSelector((store: IStore) => store);
	const [mHu, setMHu] = useState<boolean>(game?.mHu);
	const [bt, setBt] = useState<number>(game?.bt);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(game?.bt));
	const rightWidth = game.pay === PaymentType.HALF_SHOOTER ? 75 : 60;

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

	function handleBotTimeSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const speed = (event.target as HTMLInputElement).value;
		setBtLabel(speed);
		setBt(BotTimeout[speed.toUpperCase()]);
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
			<DialogContent>
				{renderSettingValue(`${PaymentLabel.LABEL}`, `${PaymentLabel[game.pay]}`, rightWidth)}
				{renderSettingValue(`${ButtonText.MINMAXTAI}`, `${game.px.join(' / ')}`, rightWidth)}
				{renderSettingCheck(
					HandDescEng.CONCEALED,
					game.sHs.includes(ScoringHand.CONCEALED) ? false : true,
					rightWidth
				)}
				{renderSettingCheck(HandDescEng.SEVEN, game.sHs.includes(ScoringHand.SEVEN) ? false : true, rightWidth)}
				{renderSettingCheck(HandDescEng.GREEN, game.sHs.includes(ScoringHand.GREEN) ? false : true, rightWidth)}
				{user?.uN === game.cO && (
					<>
						{!!game.ps.find(p => BotIds.includes(p.id)) &&
							renderBotTimeSelect(btLabel, handleBotTimeSelect, rightWidth)}
						{renderSwitch(ButtonText.MANUAL_HU, mHu, () => setMHu(prev => !prev), rightWidth)}
					</>
				)}
				{game.id === LocalFlag &&
					renderSwitch(ButtonText.REVEAL_BOT_HANDS, revealBot, () => setRevealBot(!revealBot), rightWidth)}
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
