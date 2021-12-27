import { Dialog, DialogContent, FormControl, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useContext, useState } from 'react';
import { AppFlag, Timeout } from 'shared/enums';
import { AppContext } from 'shared/hooks';
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

const AdminControls = ({ game, show, updateGame, onClose }: IModalProps) => {
	const { isLocalGame } = useContext(AppContext);
	const [mHu, setMHu] = useState<boolean>(game?.mHu);
	const [btLabel, setBtLabel] = useState<string>(getSpeedLabel(game?.bt));
	const [bt, setBt] = useState<number>(game?.bt);

	function getSpeedLabel(timeout: number) {
		switch (timeout) {
			case Timeout.FAST:
				return 'Fast';
			case Timeout.MEDIUM:
				return 'Medium';
			case Timeout.SLOW:
				return 'Slow';
			default:
				return '';
		}
	}

	const closeAndUpdate = useCallback(() => {
		if (game?.mHu !== mHu || game?.bt !== bt) {
			const updatedGame = { ...game, mHu, bt };
			updateGame(objToGame(updatedGame));
		}
		onClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game, mHu, bt, updateGame, onClose]);

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
			setBt(Timeout[speed.toUpperCase()]);
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
							<MenuItem
								key={`bt-${t}`}
								style={{ ...MuiStyles.small_dropdown_item, width: '70px' }}
								value={t}
							>
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
