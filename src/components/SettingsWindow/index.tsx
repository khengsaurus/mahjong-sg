import {
	Alert,
	Collapse,
	Dialog,
	DialogContent,
	FormControl,
	Paper,
	Switch,
	Tab,
	Tabs
} from '@mui/material';
import {
	AlertStatus,
	BackgroundColor,
	Page,
	Size,
	Status,
	TableColor,
	TileColor,
	Transition,
	Visitor
} from 'enums';
import { AppContext } from 'hooks';
import { extend, isEmpty, isEqual } from 'lodash';
import { ErrorMessage } from 'messages';
import { isMobile } from 'platform';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonText, ScreenTextEng } from 'screenTexts';
import { ServiceInstance } from 'service';
import { IStore } from 'store';
import { setHaptic, setSizes, setTheme } from 'store/actions';
import { MuiStyles, TableTheme } from 'style/MuiStyles';
import { Row } from 'style/StyledComponents';
import { StyledButton, StyledText } from 'style/StyledMui';
import { IAlert, IModalP } from 'typesPlus';
import { getTheme } from 'utility';
import './settingsWindow.scss';

interface ISettingsWindowP extends IModalP {
	accActions?: boolean;
}

const SettingsWindow = ({ onClose, show, accActions = false }: ISettingsWindowP) => {
	const { handleLocalUO, logout, navigate } = useContext(AppContext);
	const { user, theme, sizes, haptic = true } = useSelector((state: IStore) => state);
	const [alert, setAlert] = useState<IAlert>(null);
	const [backgroundColor, setBackgroundColor] = useState(theme?.backgroundColor);
	const [tableColor, setTableColor] = useState(theme?.tableColor);
	const [tileColor, setTileColor] = useState(theme?.tileColor);
	const [controlsSize, setControlsSize] = useState(sizes?.controlsSize);
	const [handSize, setHandSize] = useState(sizes?.handSize);
	const [tileSize, setTileSize] = useState(sizes?.tileSize);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [hapticOn, setHapticOn] = useState<boolean>(haptic);
	const [enOnly, setEnOnly] = useState<boolean>(theme?.enOnly || false);
	const dispatch = useDispatch();

	const flagThemeDiff = useMemo(
		() =>
			!isEqual(
				[backgroundColor, tableColor, tileColor],
				[user.bgC, user.tC, user.tBC]
			),
		[backgroundColor, tableColor, user.bgC, user.tC, user.tBC, tileColor]
	);

	const flagSizesDiff = useMemo(
		() =>
			!isEqual([controlsSize, handSize, tileSize], [user.cSz, user.hSz, user.tSz]),
		[controlsSize, handSize, user.cSz, user.hSz, user.tSz, tileSize]
	);

	useEffect(() => {
		dispatch(setTheme(getTheme(backgroundColor, tableColor, tileColor, enOnly)));
	}, [dispatch, backgroundColor, enOnly, hapticOn, tableColor, tileColor]);

	useEffect(() => {
		dispatch(setHaptic(hapticOn));
	}, [dispatch, hapticOn]);

	useEffect(() => {
		dispatch(
			setSizes({
				handSize,
				tileSize,
				controlsSize
			})
		);
	}, [dispatch, controlsSize, handSize, tileSize]);

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
			colors: Object.keys(BackgroundColor).map(
				key => BackgroundColor[key.toUpperCase()]
			)
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
		if (
			user?.id !== Visitor &&
			(flagSizesDiff ||
				flagThemeDiff ||
				user?.hp !== hapticOn ||
				user?._b[0] !== enOnly)
		) {
			const _b =
				user?._b[0] !== enOnly
					? isEmpty(user?._b)
						? [enOnly]
						: [enOnly, ...user._b.slice(1, user._b.length)]
					: user._b;
			const keyVal = {
				cSz: controlsSize,
				hSz: handSize,
				tSz: tileSize,
				bgC: backgroundColor,
				tC: tableColor,
				tBC: tileColor,
				hp: hapticOn,
				_b
			};
			ServiceInstance.FBUpdateUser(user.id, keyVal)
				.then(() => handleLocalUO(extend(user, keyVal)))
				.catch(err => console.error(err));
		}
		onClose();
	}

	function setDeleteAlert() {
		setAlert({ status: Status.ERROR, msg: ErrorMessage.DELETE_ERROR });
	}

	async function handleDeleteAccount() {
		setAlert(null);
		try {
			await ServiceInstance.FBDeleteUser(user).then(res => {
				if (res) {
					logout();
					navigate(Page.LOGIN);
				} else {
					setDeleteAlert();
				}
			});
		} catch (err) {
			console.error(err);
			setDeleteAlert();
		}
	}

	const DeleteAlert: React.FC = () => {
		function handleClose() {
			setShowDeleteAlert(false);
			setAlert(null);
		}

		return (
			<Dialog
				open={showDeleteAlert}
				BackdropProps={{ invisible: true }}
				onClose={handleClose}
			>
				<DialogContent>
					<StyledText
						text="Are you sure you wish to delete your account?"
						variant="subtitle1"
						textAlign="center"
						padding="0px"
					/>
					<StyledText
						text="There's no undoing this action!"
						variant="subtitle2"
						textAlign="center"
						padding="2px"
					/>
					<Row style={{ marginTop: -4 }}>
						<StyledButton label={ButtonText.CANCEL} onClick={handleClose} />
						<StyledButton
							label={ButtonText.DELETE}
							onClick={handleDeleteAccount}
						/>
					</Row>
					<Collapse in={!!alert} timeout={{ enter: Transition.FAST }}>
						<>
							<Alert severity={alert?.status as AlertStatus}>
								{alert?.msg || ErrorMessage.TRY_AGAIN}
							</Alert>
							<br />
						</>
					</Collapse>
				</DialogContent>
			</Dialog>
		);
	};

	const Label = ({ label }: IHasLabel) => (
		<StyledText
			text={label}
			variant="body1"
			padding="0px"
			style={{ height: 30, marginTop: 6 }}
		/>
	);

	function renderHaptic() {
		return (
			<div className="preference no-margin">
				<StyledText
					text={ScreenTextEng.HAPTICS}
					variant="subtitle1"
					padding="0"
				/>
				<Switch checked={hapticOn} onChange={() => setHapticOn(prev => !prev)} />
			</div>
		);
	}

	function renderEnOnly() {
		return (
			<div className="preference no-margin">
				<StyledText
					text={ScreenTextEng.ENGLISH_ONLY}
					variant="subtitle1"
					padding="0"
				/>
				<Switch checked={enOnly} onChange={() => setEnOnly(prev => !prev)} />
			</div>
		);
	}

	function renderAccActions() {
		return (
			<StyledButton
				label={ButtonText.DELETE_ACCOUNT}
				onClick={() => setShowDeleteAlert(true)}
				style={{
					padding: 0,
					marginTop: 5,
					textTransform: 'capitalize',
					fontSize: 15
				}}
			/>
		);
	}

	return (
		<TableTheme>
			{showDeleteAlert ? (
				<DeleteAlert />
			) : (
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={handleClose}
					PaperProps={{
						style: MuiStyles.large_dialog
					}}
					// style={{ transform }}
				>
					<DialogContent style={{ paddingBottom: '10px' }}>
						<FormControl component="fieldset">
							{preferences.map(preference =>
								preference.size ? (
									<div
										className="preference"
										key={`preference-${preference.label}`}
									>
										<Label label={preference.label} />
										<Tabs
											style={{
												...MuiStyles.tabs,
												display: 'inline-block'
											}}
											value={preference.size}
											indicatorColor="secondary"
										>
											{Object.keys(Size).map(key => {
												const size = Size[key.toUpperCase()];
												return (
													<Tab
														style={MuiStyles.tabOptions}
														key={size}
														value={size}
														label={size[0]}
														onClick={() =>
															preference.handleSelect(size)
														}
													/>
												);
											})}
										</Tabs>
									</div>
								) : null
							)}
							{preferences.map(preference =>
								preference.colors ? (
									<div
										className="preference"
										key={`preference-${preference.label}`}
									>
										<Label label={preference.label} />
										<Paper
											style={{
												...MuiStyles.tabs,
												backgroundColor: 'transparent'
											}}
										>
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
														onClick={() =>
															preference.handleSelect(rgb)
														}
													/>
												))}
											</Tabs>
										</Paper>
									</div>
								) : null
							)}
							{!accActions && isMobile && renderHaptic()}
							{renderEnOnly()}
							{accActions && renderAccActions()}
						</FormControl>
					</DialogContent>
				</Dialog>
			)}
		</TableTheme>
	);
};

export default SettingsWindow;
