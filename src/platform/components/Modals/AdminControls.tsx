import { Dialog, DialogContent, FormControl, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useState } from 'react';
import { AppFlag, BotTimeout, LocalFlag } from 'shared/enums';
import { ModalProps } from 'shared/typesPlus';
import { objToGame } from 'shared/util/parsers';
import sample_multi_hu from 'shared/__mock__/sample_multi_hu.json';
import sample_pong_hu from 'shared/__mock__/sample_pong_hu.json';
import sample_user2_pong_then_kang from 'shared/__mock__/sample_user2_pong_then_kang.json';
import sample_user3_hu from 'shared/__mock__/sample_user3_hu.json';

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = () => {
	const gameStateOptions: IGameStateOption[] = [
		{ label: 'User3 Hu', obj: sample_user3_hu },
		{ label: 'Multi Hu', obj: sample_multi_hu },
		{ label: 'User2 pong/kang', obj: sample_user2_pong_then_kang },
		{ label: 'Pong vs hu', obj: sample_pong_hu }
	];

	return (
		<>
			{gameStateOptions.map((o, ix) => (
				<StyledButton key={ix} label={o.label} onClick={() => ServiceInstance.setGame(objToGame(o.obj))} />
			))}
		</>
	);
};

const AdminControls = ({ game, show, onClose }: ModalProps) => {
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
							{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV) && game.id !== LocalFlag && (
								<Scenarios />
							)}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default AdminControls;
