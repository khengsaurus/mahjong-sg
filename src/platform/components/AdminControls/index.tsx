import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FBService from 'platform/service/MyFirebaseService';
import { TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { objToGame } from 'shared/util';
import './adminControls.scss';
import Scenarios from './Scenarios';

const AdminControls = ({ game, show, onClose }: IModalProps) => {
	function setFirebaseDoc(obj: any) {
		FBService.updateGame(objToGame(obj));
	}

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose}>
					<DialogContent>
						<IconButton style={{ position: 'absolute', top: 5, right: 5 }} onClick={onClose} disableRipple>
							<CloseIcon />
						</IconButton>
						<FormControl component="fieldset">
							{process.env.REACT_APP_DEV_FLAG === '1' && <Scenarios set={setFirebaseDoc} />}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default AdminControls;
