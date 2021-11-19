import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { MainTransparent } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useState } from 'react';
import FBService from 'platform/service/MyFirebaseService';

const DeclareHuModal = ({ game, playerSeat, show, onClose }: IModalProps) => {
	const [tai, setTai] = useState<number>(null);
	const [zimo, setZimo] = useState(false);

	async function hu() {
		game.hu = [playerSeat, tai, Number(zimo)];
		game.fN = Number(game.dealer) === playerSeat ? false : true;
		game.endRound();
		FBService.updateGame(game);
		onClose(true);
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	return (
		<MainTransparent>
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={() => onClose(false)}
				PaperProps={{
					style: {
						minWidth: '350px'
					}
				}}
			>
				<DialogContent>
					<IconButton
						style={{ position: 'absolute', top: 5, right: 5 }}
						onClick={() => onClose(false)}
						disableRipple
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6">{'Nice!'}</Typography>
					<br></br>
					<FormControl component="fieldset">
						<FormLabel component="legend">{`台: `}</FormLabel>
						<RadioGroup row value={tai} onChange={handleSetTaiNumber}>
							{[1, 2, 3, 4, 5].map((tai: number) => (
								<FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />
							))}
						</RadioGroup>
					</FormControl>
					<br></br>
					<FormControlLabel
						label="自摸"
						control={
							<Checkbox
								onChange={() => {
									setZimo(!zimo);
								}}
							/>
						}
					/>
					<DialogActions>
						<StyledButton label={`胡`} size="large" onClick={hu} disabled={!tai || game.hu.length === 3} />
					</DialogActions>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
