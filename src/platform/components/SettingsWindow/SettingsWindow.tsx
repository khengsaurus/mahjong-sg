import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { extend, isEqual } from 'lodash';
import ServiceInstance from 'platform/service/ServiceLayer';
import { MuiStyles, TableTheme } from 'platform/style/MuiStyles';
import { MainTransparent } from 'platform/style/StyledComponents';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BackgroundColor, Offset, Size, TableColor, TileColor } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { IStore } from 'shared/store';
import { setSizes, setTheme } from 'shared/store/actions';
import { IModalProps } from 'shared/typesPlus';
import { getTheme } from 'shared/util';
import './settingsWindow.scss';

interface IPreference {
	label: string;
	size?: Size;
	selectedColor?: BackgroundColor | TableColor | TileColor;
	colors?: any[];
	handleSelect: (value: Size | BackgroundColor | TableColor | TileColor) => void;
}

const SettingsWindow = ({ offset, onClose, show }: IModalProps) => {
	const { user, handleLocalUO } = useContext(AppContext);
	const { theme, sizes } = useSelector((state: IStore) => state);
	const [backgroundColor, setBackgroundColor] = useState(theme?.backgroundColor);
	const [tableColor, setTableColor] = useState(theme?.tableColor);
	const [tileColor, setTileColor] = useState(theme?.tileColor);
	const [controlsSize, setControlsSize] = useState(sizes?.controlsSize);
	const [handSize, setHandSize] = useState(sizes?.handSize);
	const [tileSize, setTileSize] = useState(sizes?.tileSize);
	const initTheme = useRef([backgroundColor, tableColor, tileColor]);
	const initSizes = useRef([controlsSize, handSize, tileSize]);
	const transform =
		offset && process.env.REACT_APP_PLATFORM === 'mobile' ? `translateY(-${Offset.HALF_MOBILE})` : null;
	const dispatch = useDispatch();

	useEffect(() => {
		const flagThemeDiff = !isEqual([backgroundColor, tableColor, tileColor], initTheme.current);
		const flagSizesDiff = !isEqual([controlsSize, handSize, tileSize], initSizes.current);
		if (flagThemeDiff) {
			dispatch(setTheme(getTheme(backgroundColor, tableColor, tileColor)));
		}
		if (flagSizesDiff) {
			dispatch(
				setSizes({
					handSize,
					tileSize,
					controlsSize
				})
			);
		}
	}, [backgroundColor, tableColor, tileColor, controlsSize, handSize, tileSize, dispatch]);

	const preferences: IPreference[] = [
		{
			label: 'Controls',
			size: controlsSize,
			handleSelect: (s: Size) => {
				setControlsSize(s);
			}
		},
		{
			label: 'Hand',
			size: handSize,
			handleSelect: (s: Size) => {
				setHandSize(s);
			}
		},
		{
			label: 'Tiles',
			size: tileSize,
			handleSelect: (s: Size) => {
				setTileSize(s);
			}
		},
		{
			label: 'Background',
			selectedColor: backgroundColor,
			handleSelect: (bgc: BackgroundColor) => {
				setBackgroundColor(bgc);
			},
			colors: Object.keys(BackgroundColor).map(key => BackgroundColor[key.toUpperCase()])
		},
		{
			label: 'Table',
			selectedColor: tableColor,
			handleSelect: (tc: TableColor) => {
				setTableColor(tc);
			},
			colors: Object.keys(TableColor).map(key => TableColor[key.toUpperCase()])
		},
		{
			label: 'Tiles',
			selectedColor: tileColor,
			handleSelect: (tbc: TileColor) => {
				setTileColor(tbc);
			},
			colors: Object.keys(TileColor).map(key => TileColor[key.toUpperCase()])
		}
	];

	function handleClose() {
		const flagThemeDiff = !isEqual([backgroundColor, tableColor, tileColor], initTheme.current);
		const flagSizesDiff = !isEqual([controlsSize, handSize, tileSize], initSizes.current);
		if (flagSizesDiff || flagThemeDiff) {
			let keyVal = {
				cSz: controlsSize,
				hSz: handSize,
				tSz: tileSize,
				bgC: backgroundColor,
				tC: tableColor,
				tBC: tileColor
			};
			ServiceInstance.FBUpdateUser(user.id, keyVal)
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
