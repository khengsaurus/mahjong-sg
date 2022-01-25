import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered, Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useCallback, useContext, useState } from 'react';
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
	width: 200
};

const GameInfo = ({ game, show, onClose }: ModalProps) => {
	const { revealBot, setRevealBot } = useContext(AppContext);
	const { user } = useSelector((store: IStore) => store);
	const [mHu, setMHu] = useState<boolean>(game?.mHu);
	const [bt, setBt] = useState<number>(game?.bt);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(game?.bt));
	// Width of right content container
	const width = game.pay === PaymentType.HALF_SHOOTER ? 75 : 60;

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
			<ListItemText secondary={ButtonText.MANUAL_HU} />
			<Centered style={{ width }}>
				<Switch checked={mHu} onChange={() => setMHu(prev => !prev)} />
			</Centered>
		</ListItem>
	);

	const renderRevealBot = () => (
		<ListItem style={{ ...padding0Height35 }}>
			<ListItemText secondary={ButtonText.REVEAL_BOT_HANDS} />
			<Centered style={{ width }}>
				<Switch checked={revealBot} onChange={() => setRevealBot(!revealBot)} />
			</Centered>
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
				<ListItemText secondary={ButtonText.BOT_SPEED} style={{ textAlign: 'left', width: 100 }} />
				<Centered style={{ width }}>
					<Select
						value={btLabel}
						onChange={handleChange}
						disableUnderline
						variant="standard"
						IconComponent={() => null}
						style={{ width: 100, fontSize: 14 }}
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

	const renderSetting = (label: string, toggle: boolean) => (
		<ListItem style={{ ...padding0Height35, height: 32 }}>
			<ListItemText secondary={label} />
			<Centered style={{ width }}>
				{toggle ? <CheckIcon fontSize={'small'} /> : <CloseIcon fontSize={'small'} />}
			</Centered>
		</ListItem>
	);

	return (
		<Dialog open={show} BackdropProps={{ invisible: true }} onClose={closeAndUpdate}>
			<DialogContent style={{ padding: '10 15 !important' }}>
				<Row className="setting">
					<StyledText text={`${PaymentLabel.LABEL}`} variant="body2" />
					<Centered style={{ width }}>
						<StyledText text={`${PaymentLabel[game.pay]}`} variant="body2" />
					</Centered>
				</Row>
				<Row className="setting">
					<StyledText text={`${ButtonText.MINMAXTAI}`} variant="body2" />
					<Centered style={{ width }}>
						<StyledText text={`${game.px.join(' / ')}`} variant="body2" />
					</Centered>
				</Row>
				{renderSetting(HandDescEng.CONCEALED, game.sHs.includes(ScoringHand.CONCEALED) ? false : true)}
				{renderSetting(HandDescEng.SEVEN, game.sHs.includes(ScoringHand.SEVEN) ? false : true)}
				{renderSetting(HandDescEng.GREEN, game.sHs.includes(ScoringHand.GREEN) ? false : true)}
				{user?.uN === game.cO && (
					<>
						{!!game.ps.find(p => BotIds.includes(p.id)) && renderBotTimeSelect()}
						{renderManualHuSelect()}
					</>
				)}
				{game.id === LocalFlag && renderRevealBot()}
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
