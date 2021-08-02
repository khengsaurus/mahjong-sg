import {
	Dialog,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	ThemeProvider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../util/hooks/AppContext';
import { rotatedMUIDialog } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	onClose: () => void;
	show: boolean;
}

const SettingsWindow = (props: Props) => {
	const {
		controlsSize,
		setControlsSize,
		handSize,
		setHandSize,
		tilesSize,
		setTilesSize,
		tileBackColor,
		setTileBackColor,
		backgroundColor,
		setBackgroundColor
	} = useContext(AppContext);
	const { onClose, show } = props;
	const [amount, setAmount] = useState(0);
	const sizes = ['medium', 'large'];
	const colors = ['brown', 'teal', 'maroon', 'black', 'grey'];

	const handleControlsSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		setControlsSize((event.target as HTMLInputElement).value);
	};
	const handleHandSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHandSize((event.target as HTMLInputElement).value);
	};
	const handleTilesSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTilesSize((event.target as HTMLInputElement).value);
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
							maxWidth: '300px',
							minWidth: '300px',
							maxHeight: '350px',
							minHeight: '350px',
							backgroundColor: 'rgb(220, 190, 150)'
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
						{/* <Typography variant="subtitle1">{'Settings'}</Typography> */}
						<br></br>
						<FormControl component="fieldset">
							<FormLabel component="legend">{`Controls size: `}</FormLabel>
							<RadioGroup row value={controlsSize} onChange={handleControlsSizeSelect}>
								{sizes.map((size: string) => {
									return (
										<FormControlLabel
											key={size}
											value={size}
											control={<Radio color="primary" />}
											label={size.charAt(0).toUpperCase() + size.slice(1)}
										/>
									);
								})}
							</RadioGroup>
							<br></br>
							<FormLabel component="legend">{`Hand: `}</FormLabel>
							<RadioGroup row value={handSize} onChange={handleHandSizeSelect}>
								{sizes.map((size: string) => {
									return (
										<FormControlLabel
											key={size}
											value={size}
											control={<Radio color="primary" />}
											label={size.charAt(0).toUpperCase() + size.slice(1)}
										/>
									);
								})}
							</RadioGroup>
							<br></br>
							<FormLabel component="legend">{`Tiles: `}</FormLabel>
							<RadioGroup row value={tilesSize} onChange={handleTilesSizeSelect}>
								{sizes.map((size: string) => {
									return (
										<FormControlLabel
											key={size}
											value={size}
											control={<Radio color="primary" />}
											label={size.charAt(0).toUpperCase() + size.slice(1)}
										/>
									);
								})}
							</RadioGroup>
							<br></br>
						</FormControl>
						<br></br>
						{/* <DialogActions>
							<Button variant="outlined" size="small" onClick={onClose} autoFocus>
								{`Apply`}
							</Button>
						</DialogActions> */}
					</DialogContent>
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default SettingsWindow;
