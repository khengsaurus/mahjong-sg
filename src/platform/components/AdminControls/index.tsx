import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import isEqual from 'lodash.isequal';
import Scenarios from 'platform/components/AdminControls/Scenarios';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useCallback, useState } from 'react';
import { IModalProps } from 'shared/typesPlus';
import { objToGame } from 'shared/util';

const AdminControls = ({ game, show, onClose }: IModalProps) => {
	const [manualHu, setManualHu] = useState<boolean>(game?.mHu || false);

	const setFirebaseDoc = useCallback((obj: any) => {
		FBService.updateGame(objToGame(obj));
	}, []);

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
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={closeAndUpdate}
					PaperProps={{
						style: {
							...MuiStyles.small_dialog
						}
					}}
				>
					<DialogContent>
						<IconButton
							style={{ position: 'absolute', top: -2, right: -2 }}
							onClick={closeAndUpdate}
							disableRipple
						>
							<CloseIcon />
						</IconButton>
						<FormControl component="fieldset">
							<FormControlLabel
								control={<Switch checked={manualHu} onChange={() => setManualHu(prev => !prev)} />}
								label="Manual Hu:"
								labelPlacement="start"
							/>
							{/* <CheckBox
								title="Manual Hu: "
								value={manualHu}
								onChange={() => setManualHu(prev => !prev)}
								defaultChecked={game.mHu}
							/> */}
							{process.env.REACT_APP_DEV_FLAG === '1' && <Scenarios set={setFirebaseDoc} />}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default AdminControls;
