import { Dialog, DialogContent, FormControl, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppFlag, LocalFlag, BotTimeout } from 'shared/enums';
import { IStore } from 'shared/store';
import { IModalProps } from 'shared/typesPlus';
import { objToGame } from 'shared/util/parsers';
import sample_multi_hu from 'shared/__mock__/sample_multi_hu.json';
import sample_pong_hu from 'shared/__mock__/sample_pong_hu.json';
import sample_user2_pong_then_kang from 'shared/__mock__/sample_user2_pong_then_kang.json';
import sample_user3_hu from 'shared/__mock__/sample_user3_hu.json';

interface IDevControls {
	set: (obj?: any) => void;
}

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions: IGameStateOption[] = [
		{ label: 'User3 Hu', obj: sample_user3_hu },
		{ label: 'Multi Hu', obj: sample_multi_hu },
		{ label: 'User2 pong/kang', obj: sample_user2_pong_then_kang },
		{ label: 'Pong vs hu', obj: sample_pong_hu }
	];

	return (
		<>
			{gameStateOptions.map((o, ix) => (
				<StyledButton key={ix} label={o.label} onClick={() => set(o.obj)} />
			))}
		</>
	);
};

const AdminControls = ({ show, onClose }: IModalProps) => {
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const [mHu, setMHu] = useState<boolean>(currGame?.mHu);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(currGame?.bt));
	const [bt, setBt] = useState<number>(currGame?.bt);
	const updateGame = useCallback(game => ServiceInstance.updateGame(game, isLocalGame), [isLocalGame]);
	// For dev
	// const updateGame = useCallback(game => ServiceInstance.setGame(game), []);

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
		if (currGame?.mHu !== mHu || currGame?.bt !== bt) {
			const updatedGame = { ...currGame, mHu, bt };
			updateGame(objToGame(updatedGame));
		}
		onClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currGame, mHu, bt, updateGame, onClose]);

	const renderManualHuSelect = () => (
		<ListItem style={{ padding: 0, justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
			<div style={{ width: '100px' }}>
				<ListItemText primary={'Manual Hu:'} />
			</div>
			<div style={{ width: '80px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<Switch checked={mHu} onChange={() => setMHu(prev => !prev)} />
			</div>
		</ListItem>
	);

	const renderBotTimeSelect = () => {
		function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
			const speed = (event.target as HTMLInputElement).value;
			setBtLabel(speed);
			setBt(BotTimeout[speed.toUpperCase()]);
		}

		return (
			<ListItem style={{ padding: 0, justifyContent: 'space-between' }}>
				<div style={{ width: '100px' }}>
					<ListItemText primary={'Bot speed:'} style={{ textAlign: 'left' }} />
				</div>
				<div style={{ width: '80px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
					<Select
						value={btLabel}
						onChange={handleChange}
						disableUnderline
						variant="standard"
						IconComponent={() => null}
						// style={{ justifyContent: 'flex-end', marginRight: -8, backgroundColor: 'orange' }}
						style={{ width: '100px' }}
					>
						{['Slow', 'Medium', 'Fast'].map(t => (
							<MenuItem key={`bt-${t}`} style={{ ...MuiStyles.small_dropdown_item }} value={t}>
								{t}
							</MenuItem>
						))}
					</Select>
				</div>
			</ListItem>
		);
	};

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={closeAndUpdate}>
					<DialogContent>
						<FormControl component="fieldset">
							{renderManualHuSelect()}
							{renderBotTimeSelect()}
							{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV) && !isLocalGame && (
								<Scenarios set={updateGame} />
							)}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default AdminControls;
