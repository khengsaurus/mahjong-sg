import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { isEqual } from 'lodash';
import { useContext, useRef } from 'react';
import { BackgroundColors, Sizes, TableColors, TileColors } from '../../global/enums';
import { MuiStyles, TableTheme } from '../../global/MuiStyles';
import { MainTransparent } from '../../global/StyledComponents';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './settingsWindow.scss';

interface Preference {
	label: string;
	size?: Sizes;
	selectedColor?: BackgroundColors | TableColors | TileColors;
	handleSelect: (value: Sizes | BackgroundColors | TableColors | TileColors) => void;
	colors?: any[];
}

const SettingsWindow = ({ onClose, show }: IModalProps) => {
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
		setTileBackColor
	} = useContext(AppContext);
	const initialValues = useRef([controlsSize, handSize, tilesSize, backgroundColor, tableColor, tileBackColor]);
	const preferences: Preference[] = [
		{ label: 'Controls', size: controlsSize, handleSelect: setControlsSize },
		{ label: 'Hand', size: handSize, handleSelect: setHandSize },
		{ label: 'Tiles', size: tilesSize, handleSelect: setTilesSize },
		{
			label: 'Background',
			selectedColor: backgroundColor,
			handleSelect: setBackgroundColor,
			colors: Object.keys(BackgroundColors).map(key => {
				return BackgroundColors[key.toUpperCase()];
			})
		},
		{
			label: 'Table',
			selectedColor: tableColor,
			handleSelect: setTableColor,
			colors: Object.keys(TableColors).map(key => {
				return TableColors[key.toUpperCase()];
			})
		},
		{
			label: 'Tiles',
			selectedColor: tileBackColor,
			handleSelect: setTileBackColor,
			colors: Object.keys(TileColors).map(key => {
				return TileColors[key.toUpperCase()];
			})
		}
	];
	function handleClose() {
		if (
			!isEqual(
				[controlsSize, handSize, tilesSize, backgroundColor, tableColor, tileBackColor],
				initialValues.current
			)
		) {
			let keyVal = {
				cSz: controlsSize,
				hSz: handSize,
				tSz: tilesSize,
				bgC: backgroundColor,
				tC: tableColor,
				tBC: tileBackColor
			};
			FBService.updateUser(user.id, keyVal)
				.then(res => {
					if (res) {
						signJwt(user);
					}
				})
				.catch(err => {
					console.error(err);
				});
		}
		onClose();
	}

	return (
		<TableTheme>
			<MainTransparent>
				<Dialog open={show} BackdropProps={{ invisible: true }} onClose={handleClose}>
					<DialogContent>
						<IconButton
							style={{ position: 'absolute', top: 5, right: 5 }}
							onClick={handleClose}
							disableRipple
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
											indicatorColor="secondary"
										>
											{Object.keys(Sizes).map(key => {
												let size = Sizes[key.toUpperCase()];
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
										<Paper style={{ ...MuiStyles.tabs, backgroundColor: 'transparent' }}>
											<Tabs
												style={{
													...MuiStyles.tabs,
													display: 'inline-block'
												}}
												value={preference.selectedColor}
												indicatorColor="secondary"
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
		</TableTheme>
	);
};

export default SettingsWindow;
