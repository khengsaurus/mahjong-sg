import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	ThemeProvider,
	Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { Game } from '../../Models/Game';
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
