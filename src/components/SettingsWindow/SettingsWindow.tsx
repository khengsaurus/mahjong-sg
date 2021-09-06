import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useContext, useRef } from 'react';
import { BackgroundColors, Sizes, TableColors, TileColors } from '../../global/enums';
import { MuiStyles } from '../../global/MuiStyles';
import { MainTransparent } from '../../global/StyledComponents';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import '../../App.scss';

interface Props {
	onClose: () => void;
	show: boolean;
}

interface Preference {
	label: string;
	size?: Sizes;
	selectedColor?: BackgroundColors | TableColors | TileColors;
	handleSelect: (value: Sizes | BackgroundColors | TableColors | TileColors) => void;
	colors?: any[];
}

const SettingsWindow = ({ onClose, show }: Props) => {
	const {
		user,
		signJwt,
		controlsSize,
		setControlsSize,
		handSize,
		setHandSize,
		tilesSize,
		setTilesSize,
		backgroundColor,
		setBackgroundColor,
		tableColor,
		setTableColor,
		tileBackColor,
		setTileBackColor,
		tableTextColor
	} = useContext(AppContext);
	const initialValues = useRef([backgroundColor, tableColor, tileBackColor]);
	const preferences: Preference[] = [
		{ label: 'Controls', size: controlsSize, handleSelect: setControlsSize },
		{ label: 'Hand', size: handSize, handleSelect: setHandSize },
		{ label: 'Tiles', size: tilesSize, handleSelect: setTilesSize },
		{
			label: 'Background',
			selectedColor: backgroundColor,
			handleSelect: setBackgroundColor,
			colors: Object.keys(BackgroundColors).map(key => {
				return BackgroundColors[key];
			})
		},
		{
			label: 'Table',
			selectedColor: tableColor,
			handleSelect: setTableColor,
			colors: Object.keys(TableColors).map(key => {
				return TableColors[key];
			})
		},
		{
			label: 'Tiles',
			selectedColor: tileBackColor,
			handleSelect: setTileBackColor,
			colors: Object.keys(TileColors).map(key => {
				return TileColors[key];
			})
		}
	];
	function handleClose() {
		console.log(initialValues.current);
		if (
			backgroundColor !== initialValues.current[0] ||
			tableColor !== initialValues.current[1] ||
			tileBackColor !== initialValues.current[2]
		) {
			user.backgroundColor = backgroundColor;
			user.tableColor = tableColor;
			user.tileBackColor = tileBackColor;
			FBService.updateUser(user)
				.then(res => {
					if (res) {
						console.log(user);
						signJwt(user);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
		onClose();
	}

	return (
		<MainTransparent>
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={handleClose}
				PaperProps={{
					style: {
						...MuiStyles.modal,
						backgroundColor: tableColor
					}
				}}
			>
				<DialogContent>
					<IconButton
						style={{ color: tableTextColor, position: 'absolute', top: 5, right: 5 }}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
					<FormControl component="fieldset">
						{preferences.map(preference => {
							return preference.size ? (
								<div className="preference" key={`preference-${preference.label}`}>
									<Typography variant="subtitle1" display="inline">
										{`${preference.label}:`}
									</Typography>
									<Tabs
										style={{
											...MuiStyles.tabs,
											display: 'inline-block'
										}}
										value={preference.size}
										indicatorColor="primary" // TabIndicatorProps={{ style: { background: backgroundColor } }}
									>
										{Object.keys(Sizes).map(key => {
											let size = Sizes[key];
											return (
												<Tab
													style={{
														...MuiStyles.tabOptions
													}}
													fullWidth={false}
													key={size}
													value={size}
													label={size}
													onClick={() => {
														preference.handleSelect(size);
													}}
												/>
											);
										})}
									</Tabs>
								</div>
							) : null;
						})}
						{preferences.map(preference => {
							return preference.colors ? (
								<div className="preference" key={`preference-${preference.label}`}>
									<Typography variant="subtitle1" display="inline">
										{`${preference.label}:`}
									</Typography>
									<Paper style={{ ...MuiStyles.tabs, backgroundColor: 'white' }}>
										<Tabs
											style={{
												...MuiStyles.tabs,
												display: 'inline-block'
											}}
											value={preference.selectedColor}
											indicatorColor="primary"
										>
											{preference.colors.map(rgb => {
												return (
													<Tab
														style={{
															...MuiStyles.tabColorOptions,
															backgroundColor: rgb
														}}
														key={rgb}
														value={rgb}
														onClick={() => {
															preference.handleSelect(rgb);
														}}
													/>
												);
											})}
										</Tabs>
									</Paper>
								</div>
							) : null;
						})}
					</FormControl>
				</DialogContent>
			</Dialog>
		</MainTransparent>
	);
};

export default SettingsWindow;
