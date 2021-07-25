import {
	Collapse,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FaceIcon from '@material-ui/icons/Face';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import React, { useContext, useState } from 'react';
import FBService from '../../service/FirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { User } from '../../Models/User';
import './SearchForms.scss';

const UserSearchForm: React.FC = () => {
	const { user, players, setPlayers } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundUsers, setFoundUsers] = useState<Array<User>>([]);
	const [searchFor, setSearchFor] = useState('');

	async function search(username: string) {
		let foundUsers: Array<User> = [];
		await FBService.searchUser(username).then(data => {
			if (!data.empty) {
				data.docs.forEach(doc => {
					foundUsers.push(new User(doc.id, doc.data().username, doc.data().photoUrl));
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
			search(str);
		} else {
			setShowOptions(false);
		}
	}

	function notSelected(user: User): boolean {
		for (let i = 0; i < players.length; i++) {
			if (user.username === players[i].username) {
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

	const markup: JSX.Element = (
		<div className="search-form-container">
			<List>
				{/* <ListItem> */}
				<div className="search-box">
					<TextField
						label={players.length < 4 ? 'Find user' : 'Players selected'}
						size="small"
						onChange={e => {
							handleFormChange(e.target.value);
						}}
						value={searchFor}
						disabled={players.length === 4}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										color="primary"
										component="span"
										size="small"
										onClick={() => {
											showOptions ? setShowOptions(false) : search(searchFor);
										}}
										disabled={searchFor.trim() === ''}
									>
										{showOptions ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
									</IconButton>
								</InputAdornment>
							)
						}}
						onKeyPress={e => {
							if (searchFor.trim() !== '' && e.key === 'Enter') {
								search(searchFor);
							}
						}}
					/>
				</div>
				{/* </ListItem> */}
				<Collapse in={showOptions} timeout={300} unmountOnExit>
					<List disablePadding>
						{foundUsers.length > 0 &&
							foundUsers.map(foundUser => {
								if (user && user.id !== foundUser.id && notSelected(foundUser)) {
									return (
										<ListItem
											className="list-item"
											button
											key={foundUser.id}
											onClick={() => {
												handleSelect(foundUser);
											}}
										>
											<ListItemText primary={foundUser.username} />
											<ListItemIcon>
												<FaceIcon />
											</ListItemIcon>
										</ListItem>
									);
								} else {
									return null;
								}
							})}
					</List>
				</Collapse>
			</List>
		</div>
	);

	return markup;
};

export default UserSearchForm;
