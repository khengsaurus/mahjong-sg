import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FaceIcon from '@mui/icons-material/Face';
import {
	Collapse,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	TextField
} from '@mui/material';
import { CustomFade } from 'components';
import { Bot, BotIds, BotName, Transition } from 'enums';
import { AppContext, useDebounce } from 'hooks';
import { User } from 'models';
import { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText } from 'screenTexts';
import { ServiceInstance } from 'service';
import { IStore } from 'store';
import { Centered } from 'style/StyledComponents';
import './searchForm.scss';

const UserSearchForm: React.FC = () => {
	const { user } = useSelector((state: IStore) => state);
	const { players, setPlayers } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);
	const [searchFor, setSearchFor] = useState('');
	const [actualSearch, setActualSearch] = useState('');

	const searchForUser = useCallback(
		async (uN: string) => {
			let foundUsers: Array<User> = [];
			await ServiceInstance.FBSearchUser(uN, user.uN).then(data => {
				if (data.length > 0) {
					data.forEach(u => {
						foundUsers.push(new User(u.id, u.uN, u.email));
					});
					if (foundUsers.length > 0) {
						setFoundUsers(foundUsers);
						setShowOptions(true);
					}
				}
			});
		},
		[user?.uN]
	);

	useDebounce(searchForUser, actualSearch);

	function handleFormChange(str: string): void {
		setSearchFor(str);
		if (str.length > 3) {
			setActualSearch(str);
		} else {
			setActualSearch('');
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
		return new User(botId, BotName[botId] || Bot, '');
	};

	const renderAddBotButton = () => (
		<CustomFade show={!showOptions && players.length < 4} timeout={Transition.MEDIUM}>
			<Centered>
				<ListItem className="list-item">
					<ListItemText primary={ButtonText.ADD_BOT} />
					<Centered style={{ width: 30 }}>
						<IconButton
							onClick={() => {
								if (players.length < 4) {
									setSearchFor('');
									setPlayers([...players, generateBot()]);
								}
							}}
							disabled={showOptions || players.length === 4}
							disableRipple
						>
							<AddIcon />
						</IconButton>
					</Centered>
				</ListItem>
			</Centered>
		</CustomFade>
	);

	function refocusInput() {
		document.getElementById('search-input')?.focus();
	}

	return (
		<Centered className="search-form-container">
			<List>
				<ListItem className="list-item" style={{ marginBottom: '8px' }}>
					<TextField
						id="search-input"
						label={players.length < 4 ? 'Find user' : 'Players chosen'}
						onChange={e => handleFormChange(e.target.value?.toLowerCase())}
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
												showOptions
													? setShowOptions(false)
													: searchForUser(searchFor);
											}}
											disabled={searchFor.trim() === ''}
											disableRipple
										>
											<ChevronRightIcon
												color={
													showOptions ? 'secondary' : 'primary'
												}
												style={{
													transition: '300ms',
													transform: showOptions
														? 'rotate(90deg)'
														: null
												}}
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
					className="list-item"
					timeout={Transition.FAST}
				>
					{foundUsers.map(foundUser =>
						user && user.id !== foundUser.id && notSelected(foundUser) ? (
							<ListItem
								className="list-item"
								button
								key={foundUser.id}
								style={{ borderRadius: '5px' }}
								onClick={() => {
									players?.length < 3 && refocusInput();
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
