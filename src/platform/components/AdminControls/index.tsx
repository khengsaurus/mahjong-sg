import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import isEqual from 'lodash.isequal';
import Scenarios from 'platform/components/AdminControls/Scenarios';
import CheckBox from 'platform/components/Form';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useCallback, useState } from 'react';
import { objToGame } from 'shared/util';
import './adminControls.scss';

const AdminControls = ({ game, show, onClose }: IModalProps) => {
	const [manageHu, setManageHu] = useState(game?.mHu || false);

	const setFirebaseDoc = useCallback((obj: any) => {
		FBService.updateGame(objToGame(obj));
	}, []);

	const closeAndUpdate = useCallback(() => {
		const updatedGame = { ...game, mHu: manageHu };
		if (!isEqual(updatedGame, game)) {
			setFirebaseDoc(updatedGame);
		}
		onClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [manageHu, setFirebaseDoc, onClose]);

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
							style={{ position: 'absolute', top: 5, right: 8 }}
							onClick={closeAndUpdate}
							disableRipple
						>
							<CloseIcon />
						</IconButton>
						<FormControl component="fieldset">
							<CheckBox
								title="Manual Hu: "
								value={manageHu}
								onChange={() => setManageHu(prev => !prev)}
								defaultChecked={game.mHu}
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
