import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import { useContext } from 'react';
import { Sizes } from '../../Globals';
import { AppContext } from '../../util/hooks/AppContext';
import './ControlsMedium.scss';

interface Props {
	onClose: () => void;
	show: boolean;
}

const SettingsWindow = ({ onClose, show }: Props) => {
	const {
		controlsSize,
		setControlsSize,
		handSize,
		setHandSize,
		tilesSize,
		setTilesSize
		// tileBackColor, setTileBackColor, backgroundColor, setBackgroundColor
	} = useContext(AppContext);
	const sizes = [Sizes.small, Sizes.medium, Sizes.large];

	const handleControlsSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		let size = (event.target as HTMLInputElement).value as Sizes;
		setControlsSize(size);
	};
	const handleHandSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		let size = (event.target as HTMLInputElement).value as Sizes;
		setHandSize(size);
	};
	const handleTilesSizeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTilesSize((event.target as HTMLInputElement).value as Sizes);
	};

	return (
		<div className="main transparent">
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={onClose}
				PaperProps={{
					style: {
						maxWidth: '400px',
						minWidth: '400px',
						maxHeight: '300px',
						minHeight: '300px',
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
					<br></br>
					<FormControl component="fieldset">
						<FormLabel component="legend">{`Controls size: `}</FormLabel>
						<RadioGroup row value={controlsSize} onChange={handleControlsSizeSelect}>
							{sizes.map((size: Sizes) => {
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
							{sizes.map((size: Sizes) => {
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
							{sizes.map((size: Sizes) => {
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
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SettingsWindow;
