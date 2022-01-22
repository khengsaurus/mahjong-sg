import { Dialog, DialogContent, FormControl, ListItem, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { BotTimeout, LocalFlag } from 'shared/enums';
import { IStore } from 'shared/store';
import { ModalProps } from 'shared/typesPlus';
import { isDev } from 'shared/util';
import { objToGame } from 'shared/util/parsers';

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = () => {
	const gameStateOptions: IGameStateOption[] = [
		// { label: 'User3 Hu', obj: sample_user3_hu },
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
		<ListItem style={{ padding: 0, height: 40 }}>
			<div style={{ width: '100px' }}>
				<ListItemText primary={'Manual Hu:'} />
			</div>
			<Row style={{ width: '80px' }}>
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
			<ListItem style={{ padding: 0, justifyContent: 'space-between', height: 40 }}>
				<div style={{ width: '100px' }}>
					<ListItemText primary={'Bot speed:'} style={{ textAlign: 'left' }} />
				</div>
				<Row style={{ width: '80px' }}>
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
				</Row>
			</ListItem>
		);
	};

	return (
		<Dialog open={show} BackdropProps={{ invisible: true }} onClose={closeAndUpdate}>
			<DialogContent>
				{user?.uN === game.cO && (
					<FormControl component="fieldset">
						{renderManualHuSelect()}
						{renderBotTimeSelect()}
						{isDev() && game.id !== LocalFlag && <Scenarios />}
					</FormControl>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AdminControls;
