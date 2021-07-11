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
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './UserSearchForm.scss';

const UserSearchForm: React.FC = () => {
	const { user, players, setPlayers } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [userOptions, setUserOptions] = useState<Array<User>>([]);
	const [searchFor, setSearchFor] = useState('');

	async function search(username: string) {
		let foundUsers: Array<User> = [];
		await firebaseService.searchUser(username).then(data => {
			if (!data.empty) {
				data.docs.forEach(doc => {
					foundUsers.push({ id: doc.id, username: doc.data().username, photoUrl: doc.data().photoUrl });
				});
				if (foundUsers.length > 0) {
					setUserOptions(foundUsers);
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

	function handleSelect(selectedPlayer: User) {
		setPlayers([...players, selectedPlayer]);
		setSearchFor('');
		setShowOptions(false);
	}

	const markup: JSX.Element = (
		<div className="user-search-form-container">
			<List>
				<ListItem>
					<div>
						<TextField
							id="foundUsersList"
							label={players.length < 4 ? 'Find user' : '4 players selected'}
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
											aria-label="upload picture"
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
				</ListItem>
				<Collapse in={showOptions} timeout={300} unmountOnExit>
					<List component="div" disablePadding>
						{userOptions.length > 0 &&
							userOptions.map(corres => {
								if (user && user.id !== corres.id && !players.includes(corres)) {
									return (
										<ListItem
											button
											key={corres.id}
											onClick={() => {
												handleSelect(corres);
											}}
										>
											<ListItemIcon>
												<FaceIcon />
											</ListItemIcon>
											<ListItemText primary={corres.username} />
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
