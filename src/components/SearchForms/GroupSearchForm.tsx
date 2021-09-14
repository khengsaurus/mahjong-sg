import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FaceIcon from '@material-ui/icons/Face';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useContext, useState } from 'react';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './SearchForms.scss';

const GroupSearchForm: React.FC = () => {
	const { players, setPlayers } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundGroups, setFoundGroups] = useState<Group[]>([]);
	const [searchFor, setSearchFor] = useState('');

	async function search(groupName: string) {
		await FBService.searchUser(groupName).then(groups => {
			// setFoundGroups(groups)
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

	function handleSelect(group: Group) {
		setPlayers([...group.users]);
		setSearchFor('');
		setShowOptions(false);
	}

	const markup: JSX.Element = (
		<div className="search-form-container group">
			<List>
				<ListItem>
					<div>
						<TextField
							id="foundUsersList"
							label={'Search groups'}
							size="small"
							onChange={e => {
								handleFormChange(e.target.value);
							}}
							value={searchFor}
							disabled={players.length > 0}
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
				</ListItem>
				<Collapse in={showOptions} timeout={300} unmountOnExit>
					<List component="div" disablePadding>
						{foundGroups.length > 0 &&
							foundGroups.map(group => {
								return (
									<ListItem
										button
										key={group.name}
										onClick={() => {
											handleSelect(group);
										}}
									>
										<ListItemIcon>
											<FaceIcon />
										</ListItemIcon>
										<ListItemText primary={group.name} />
									</ListItem>
								);
							})}
					</List>
				</Collapse>
			</List>
		</div>
	);

	return markup;
};

export default GroupSearchForm;
