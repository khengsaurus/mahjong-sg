import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Scenarios from 'platform/components/AdminControls/Scenarios';
import FBService from 'platform/service/MyFirebaseService';
import { TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useCallback } from 'react';
import { objToGame } from 'shared/util';
import CheckBox from 'platform/components/Form';
import './adminControls.scss';

const AdminControls = ({ game, show, onClose }: IModalProps) => {
	const setFirebaseDoc = useCallback((obj: any) => {
		FBService.updateGame(objToGame(obj));
	}, []);

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose}>
					<DialogContent>
						<IconButton style={{ position: 'absolute', top: 5, right: 8 }} onClick={onClose} disableRipple>
							<CloseIcon />
						</IconButton>
						<FormControl component="fieldset">
							<CheckBox
								title="Manual Hu: "
								defaultChecked={game.mHu}
								expanded
								onChange={() => {
									const updatedGame = { ...game, mHu: !game.mHu };
									setFirebaseDoc(updatedGame);
								}}
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
