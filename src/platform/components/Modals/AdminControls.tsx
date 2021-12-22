import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import isEqual from 'lodash.isequal';
import { TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useState } from 'react';
import { IModalProps } from 'shared/typesPlus';
import { objToGame } from 'shared/util/parsers';
import sample_multi_hu from 'shared/__mock__/sample_multi_hu.json';
import sample_user1_close_hu from 'shared/__mock__/sample_user1_close_hu.json';
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
		{ label: 'User1 close to hu', obj: sample_user1_close_hu }
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
	const [manualHu, setManualHu] = useState<boolean>(game?.mHu || false);

	const setFirebaseDoc = useCallback(
		(obj: any) => {
			updateGame(objToGame(obj));
		},
		[updateGame]
	);

	const closeAndUpdate = useCallback(() => {
		const updatedGame = { ...game, mHu: manualHu };
		if (!isEqual(updatedGame, game)) {
			setFirebaseDoc(updatedGame);
		}
		onClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game?.mHu, manualHu, setFirebaseDoc, onClose]);

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={closeAndUpdate}>
					<DialogContent>
						<FormControl component="fieldset">
							<FormControlLabel
								control={<Switch checked={manualHu} onChange={() => setManualHu(prev => !prev)} />}
								label="Manual Hu:"
								labelPlacement="start"
							/>
							{process.env.REACT_APP_DEV_FLAG === '1' && <Scenarios set={setFirebaseDoc} />}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default AdminControls;
