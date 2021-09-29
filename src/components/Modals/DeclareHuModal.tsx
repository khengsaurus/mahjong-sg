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
import { useState } from 'react';
import { MainTransparent } from '../../global/StyledComponents';
import { StyledButton } from '../../global/StyledMui';
import { Game } from '../../Models/Game';
import FBService from '../../service/MyFirebaseService';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: (didHu?: boolean) => void;
	show: boolean;
}

const DeclareHuModal = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	const [tai, setTai] = useState<number>(null);
	const [zimo, setZimo] = useState(false);

	async function hu() {
		game.hu = [playerSeat, tai, Number(zimo)];
		game.flagProgress = Number(game.dealer) === playerSeat ? Boolean(false) : Boolean(true);
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
					<IconButton style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => onClose(false)}>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6">{'Nice!'}</Typography>
					<br></br>
					<FormControl component="fieldset">
						<FormLabel component="legend">{`台: `}</FormLabel>
						<RadioGroup row value={tai} onChange={handleSetTaiNumber}>
							{[1, 2, 3, 4, 5].map((tai: number) => {
								return <FormControlLabel key={tai} value={tai} control={<Radio />} label={tai} />;
							})}
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
						<StyledButton label={`胡`} onClick={hu} disabled={!tai || game.hu.length === 3} />
					</DialogActions>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default DeclareHuModal;
