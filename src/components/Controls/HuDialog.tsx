import Button from '@material-ui/core/Button';
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
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { Game } from '../../models/Game';
import FBService from '../../service/MyFirebaseService';
import { rotatedMUIDialog } from '../../util/utilFns';
import './ControlsMedium.scss';

interface Props {
	game: Game;
	playerSeat: number;
	onClose: () => void;
	show: boolean;
}

const HuDialog = (props: Props) => {
	const { game, playerSeat, onClose, show } = props;
	const [tai, setTai] = useState<number>(null);
	const [zimo, setZimo] = useState(false);

	async function hu() {
		game.hu = [playerSeat, tai, zimo ? 1 : 0];
		game.flagProgress = Number(game.dealer) === playerSeat ? Boolean(false) : Boolean(true);
		game.endRound();
		FBService.updateGame(game);
		onClose();
	}

	const handleSetTaiNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTai(parseInt((event.target as HTMLInputElement).value));
	};

	return (
		<div className="main transparent">
			<ThemeProvider theme={rotatedMUIDialog}>
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={onClose}
					PaperProps={{
						style: {
							minWidth: '350px',
							backgroundColor: 'rgb(215, 195, 170)'
						}
					}}
				>
					<DialogContent>
						<IconButton
							style={{ color: 'black', position: 'absolute', top: '12px', right: '15px' }}
							onClick={onClose}
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6">{'Nice!'}</Typography>
						<br></br>
						<FormControl component="fieldset">
							<FormLabel component="legend">{`台: `}</FormLabel>
							<RadioGroup row value={tai} onChange={handleSetTaiNumber}>
								{[1, 2, 3, 4, 5].map((tai: number) => {
									return (
										<FormControlLabel
											key={tai}
											value={tai}
											control={<Radio color="primary" />}
											label={tai}
										/>
									);
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
									color="primary"
								/>
							}
						/>
						<DialogActions>
							<Button
								variant="outlined"
								size="small"
								onClick={hu}
								disabled={!tai || game.hu.length === 3}
								autoFocus
							>
								Hu
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default HuDialog;
