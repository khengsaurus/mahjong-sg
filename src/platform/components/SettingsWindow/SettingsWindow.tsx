import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { extend, isEqual } from 'lodash';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useContext, useRef } from 'react';
import { BackgroundColor, Offset, Size, TableColor, TileColor } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IModalProps } from 'shared/typesPlus';
import './settingsWindow.scss';

interface IPreference {
	label: string;
	size?: Size;
	selectedColor?: BackgroundColor | TableColor | TileColor;
	colors?: any[];
	handleSelect: (value: Size | BackgroundColor | TableColor | TileColor) => void;
}

const SettingsWindow = ({ offset, onClose, show }: IModalProps) => {
	const {
		user,
		handleLocalUO,
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
	const transform =
		offset && process.env.REACT_APP_PLATFORM === 'mobile' ? `translateY(-${Offset.HALF_MOBILE})` : null;

	const preferences: IPreference[] = [
		{ label: 'Controls', size: controlsSize, handleSelect: setControlsSize },
		{ label: 'Hand', size: handSize, handleSelect: setHandSize },
		{ label: 'Tiles', size: tilesSize, handleSelect: setTilesSize },
		{
			label: 'Background',
			selectedColor: backgroundColor,
			handleSelect: setBackgroundColor,
			colors: Object.keys(BackgroundColor).map(key => BackgroundColor[key.toUpperCase()])
		},
		{
			label: 'Table',
			selectedColor: tableColor,
			handleSelect: setTableColor,
			colors: Object.keys(TableColor).map(key => TableColor[key.toUpperCase()])
		},
		{
			label: 'Tiles',
			selectedColor: tileBackColor,
			handleSelect: setTileBackColor,
			colors: Object.keys(TileColor).map(key => TileColor[key.toUpperCase()])
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
						let updatedUser = extend(user, keyVal);
						handleLocalUO(updatedUser);
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
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={handleClose}
					PaperProps={{
						style: {
							...MuiStyles.large_dialog
						}
					}}
					style={{ transform }}
				>
					<DialogContent>
						<FormControl component="fieldset">
							{preferences.map(preference =>
								preference.size ? (
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
											{Object.keys(Size).map(key => {
												let size = Size[key.toUpperCase()];
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
								) : null
							)}
							{preferences.map(preference =>
								preference.colors ? (
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
												{preference.colors.map(rgb => (
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
												))}
											</Tabs>
										</Paper>
									</div>
								) : null
							)}
						</FormControl>
					</DialogContent>
				</Dialog>
			</MainTransparent>
		</TableTheme>
	);
};

export default SettingsWindow;
