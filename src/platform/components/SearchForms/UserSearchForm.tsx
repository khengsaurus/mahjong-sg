import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FaceIcon from '@material-ui/icons/Face';
import AddIcon from '@mui/icons-material/Add';
import FBService from 'platform/service/MyFirebaseService';
import { Centered } from 'platform/style/StyledComponents';
import { useContext, useState } from 'react';
import { BotIds, BotName, Timeout } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { ITheme } from 'shared/typesPlus';
import './searchForms.scss';

const UserSearchForm: React.FC = () => {
	const { user, players, setPlayers, mainTextColor } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);
	const [searchFor, setSearchFor] = useState('');

	async function searchForUser(uN: string) {
		let foundUsers: Array<User> = [];
		await FBService.searchUser(uN, user.uN).then(data => {
			if (!data.empty) {
				data.docs.forEach(doc => {
					let data = doc.data();
					foundUsers.push(new User(doc.id, data.uN, data.pUrl, data.email));
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
			searchForUser(str);
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
		return new User(botId, BotName[botId] || 'Bot', '', '');
	};

	const renderAddBotButton = () => (
		<Fade in={!showOptions && players.length < 4} timeout={{ enter: Timeout.SLOW }} unmountOnExit>
			<ListItem className="user list-item" style={{ marginTop: '10px !important' }}>
				<ListItemText secondary={`Add bot`} />
				<IconButton
					onClick={() => {
						setPlayers([...players, generateBot()]);
					}}
					style={{ justifyContent: 'flex-end', marginRight: -12 }}
					disableRipple
				>
					<AddIcon />
				</IconButton>
			</ListItem>
		</Fade>
	);

	const useStyles = makeStyles((theme: ITheme) =>
		createStyles({
			text: {
				color: mainTextColor
			},
			rightChevron: {
				transition: '200ms'
			},
			downChevron: {
				transition: '200ms',
				transform: 'rotate(90deg)'
			}
		})
	);
	const classes = useStyles();

	return (
		<Centered className="search-form-container">
			<List>
				<ListItem className="search-box list-item">
					<TextField
						label={players.length < 4 ? 'Find user' : 'Players chosen'}
						onChange={e => {
							handleFormChange(e.target.value);
						}}
						value={searchFor}
						InputLabelProps={{
							className: classes.text
						}}
						InputProps={{
							color: 'secondary',
							disabled: players.length >= 4,
							endAdornment: (
								<InputAdornment position="end" style={{ marginRight: -11 }}>
									<IconButton
										component="span"
										onClick={() => {
											showOptions ? setShowOptions(false) : searchForUser(searchFor);
										}}
										disabled={searchFor.trim() === ''}
										disableRipple
									>
										<ChevronRightIcon
											className={showOptions ? classes.downChevron : classes.rightChevron}
											color={showOptions ? 'secondary' : 'primary'}
										/>
									</IconButton>
								</InputAdornment>
							)
						}}
						onKeyPress={e => {
							if (searchFor.trim() !== '' && e.key === 'Enter') {
								searchForUser(searchFor);
							}
						}}
					/>
				</ListItem>
				<Collapse
					in={showOptions && foundUsers.length > 0}
					className="search-box list-item"
					timeout={Timeout.FAST}
					unmountOnExit
				>
					{foundUsers.map(foundUser =>
						user && user.id !== foundUser.id && notSelected(foundUser) ? (
							<ListItem
								className="user list-item"
								button
								key={foundUser.id}
								style={{
									borderRadius: '5px'
								}}
								onClick={() => {
									handleSelect(foundUser);
								}}
							>
								<ListItemText primary={foundUser.uN} className={classes.text} />
								<ListItemIcon
									style={{
										justifyContent: 'flex-end'
									}}
								>
									<FaceIcon color="primary" />
								</ListItemIcon>
							</ListItem>
						) : null
					)}
				</Collapse>
			</List>
			{renderAddBotButton()}
		</Centered>
	);
};

export default UserSearchForm;
