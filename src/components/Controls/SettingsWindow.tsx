import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useContext } from 'react';
import { BackgroundColors, Sizes, TableColors, TileColors } from '../../global/enums';
import { MainTransparent, MuiStyles } from '../../global/styles';
import { AppContext } from '../../util/hooks/AppContext';
import './ControlsMedium.scss';

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
		textColor
	} = useContext(AppContext);
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

	return (
		<MainTransparent>
			<Dialog
				open={show}
				BackdropProps={{ invisible: true }}
				onClose={onClose}
				PaperProps={{
					style: {
						...MuiStyles.modal,
						backgroundColor: `${tableColor}`
					}
				}}
			>
				<DialogContent>
					<IconButton
						style={{ color: `${textColor}`, position: 'absolute', top: 5, right: 5 }}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
					<FormControl component="fieldset">
						{/* <Typography style={{ color: `${textColor}` }} variant="h6">
							{`Sizes`}
						</Typography> */}
						{preferences.map(preference => {
							return preference.size ? (
								<div className="preference" key={`preference-${preference.label}`}>
									<Typography style={{ color: `${textColor}` }} variant="subtitle1" display="inline">
										{`${preference.label}:`}
									</Typography>
									<Tabs
										style={{
											...MuiStyles.tabs,
											display: 'inline-block'
										}}
										indicatorColor="primary"
										// TabIndicatorProps={{ style: { background: backgroundColor } }}
										value={preference.size}
									>
										{Object.keys(Sizes).map(key => {
											let size = Sizes[key];
											return (
												<Tab
													style={{
														...MuiStyles.tabOptions,
														color: textColor
													}}
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
						{/* <Typography style={{ color: `${textColor}` }} variant="h6">
							{`Colors`}
						</Typography> */}
						{preferences.map(preference => {
							return preference.colors ? (
								<div className="preference" key={`preference-${preference.label}`}>
									<Typography style={{ color: `${textColor}` }} variant="subtitle1" display="inline">
										{`${preference.label}:`}
									</Typography>
									{/* <div className="options">
										{preference.colors.map(rgb => {
											return (
												<div
													key={`${preference.label}-option-${rgb}`}
													style={{ backgroundColor: `${rgb}` }}
													className={
														rgb === preference.selectedColor && preference.label === 'Table'
															? 'color-option selected'
															: 'color-option'
													}
												/>
											);
										})}
									</div> */}
									<Paper style={{ ...MuiStyles.tabs, backgroundColor: 'white' }}>
										<Tabs
											style={{
												...MuiStyles.tabs,
												display: 'inline-block'
											}}
											indicatorColor="primary"
											// TabIndicatorProps={{ style: { background: backgroundColor } }}
											value={preference.selectedColor}
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
