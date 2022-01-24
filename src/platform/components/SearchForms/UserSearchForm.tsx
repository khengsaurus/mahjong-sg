import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FaceIcon from '@mui/icons-material/Face';
import { Collapse, Fade, IconButton, InputAdornment, List, ListItem, ListItemText, TextField } from '@mui/material';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Centered } from 'platform/style/StyledComponents';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bot, BotIds, BotName, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { IStore } from 'shared/store';
import './searchForm.scss';

const UserSearchForm: React.FC = () => {
	const { user } = useSelector((state: IStore) => state);
	const { players, setPlayers } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);
	const [searchFor, setSearchFor] = useState('');

	async function searchForUser(uN: string) {
		let foundUsers: Array<User> = [];
		await ServiceInstance.FBSearchUser(uN, user.uN).then(data => {
			if (data.length > 0) {
				data.forEach(u => {
					foundUsers.push(new User(u.id, u.uN, u.pUrl, u.email));
				});
				if (foundUsers.length > 0) {
					setFoundUsers(foundUsers);
					setShowOptions(true);
				}
			}
		});
	}

	function handleFormChange(str: string): void {
		setSearchFor(str);
		if (str.length > 3) {
			searchForUser(str.toLowerCase());
		} else {
			setShowOptions(false);
		}
	}

	function notSelected(user: User): boolean {
		for (let i = 0; i < players.length; i++) {
			if (user.uN === players[i].uN) {
				return false;
			}
		}
		return true;
	}

	function handleSelect(selectedPlayer: User) {
		setPlayers([...players, selectedPlayer]);
		setSearchFor('');
		setShowOptions(false);
	}

	const generateBot = () => {
		const pIds = players.map(p => p.id);
		const availBots = BotIds.filter(b => !pIds.includes(b));
		const botIndex = Math.floor(Math.random() * (availBots.length - 0.01));
		const botId = availBots[botIndex];
		return new User(botId, BotName[botId] || Bot, '', '');
	};

	const renderAddBotButton = () => (
		<Fade in={!showOptions && players.length < 4} timeout={{ enter: Transition.MEDIUM }} unmountOnExit>
			<div>
				<ListItem className="list-item" style={{ paddingTop: 6 }}>
					<ListItemText primary={`Add bot`} />
					<Centered style={{ width: 30 }}>
						<IconButton
							onClick={() => {
								if (players.length < 4) {
									setSearchFor('');
									setPlayers([...players, generateBot()]);
								}
							}}
							disabled={showOptions}
							disableRipple
						>
							<AddIcon />
						</IconButton>
					</Centered>
				</ListItem>
			</div>
		</Fade>
	);

	function refocusInput() {
		document.getElementById('search-input')?.focus();
	}

	return (
		<Centered className="search-form-container">
			<List>
				<ListItem className="search-box list-item" style={{ marginBottom: '8px' }}>
					<TextField
						id="search-input"
						label={players.length < 4 ? 'Find user' : 'Players chosen'}
						onChange={e => {
							handleFormChange(e.target.value?.toLowerCase());
						}}
						value={searchFor}
						variant="standard"
						InputProps={{
							color: 'secondary',
							disabled: players.length >= 4,
							endAdornment: (
								<InputAdornment position="end">
									<Centered style={{ width: 30 }}>
										<IconButton
											component="span"
											onClick={() => {
												if (players?.length < 4) {
													refocusInput();
												}
												showOptions ? setShowOptions(false) : searchForUser(searchFor);
											}}
											disabled={searchFor.trim() === ''}
											disableRipple
										>
											<ChevronRightIcon
												color={showOptions ? 'secondary' : 'primary'}
												style={
													showOptions
														? { transition: '300ms', transform: 'rotate(90deg)' }
														: { transition: '300ms' }
												}
											/>
										</IconButton>
									</Centered>
								</InputAdornment>
							)
						}}
						onKeyPress={e => {
							if (searchFor.trim() && e.key === 'Enter') {
								searchForUser(searchFor);
							}
						}}
					/>
				</ListItem>
				<Collapse
					in={showOptions && foundUsers.length > 0}
					className="search-box list-item"
					timeout={Transition.FAST}
					unmountOnExit
				>
					{foundUsers.map(foundUser =>
						user && user.id !== foundUser.id && notSelected(foundUser) ? (
							<ListItem
								className="list-item"
								button
								key={foundUser.id}
								style={{
									borderRadius: '5px'
								}}
								onClick={() => {
									if (players?.length < 3) {
										refocusInput();
									}
									handleSelect(foundUser);
								}}
							>
								<ListItemText primary={foundUser.uN} />
								<Centered style={{ width: 30 }}>
									<FaceIcon color="primary" />
								</Centered>
							</ListItem>
						) : null
					)}
				</Collapse>
				{renderAddBotButton()}
			</List>
		</Centered>
	);
};

export default UserSearchForm;
