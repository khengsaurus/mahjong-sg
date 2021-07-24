import { Button, IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import MoodIcon from '@material-ui/icons/Mood';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '../../App';
import HomeButton from '../../components/HomeButton';
import UserSearchForm from '../../components/SearchForms/UserSearchForm';
import { User } from '../../Models/User';
import * as firebaseService from '../../service/firebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import { setGame } from '../../util/store/actions';
import Login from '../Login';
import './NewGame.scss';

const NewGame = () => {
	const dispatch = useDispatch();
	const { user, validateJWT, players, setPlayers } = useContext(AppContext);
	// const [groupName, setGroupName] = useState('');
	// const [groupNameInput, setGroupNameInput] = useState(false);

	useEffect(() => {
		validateJWT();
	}, [validateJWT]);

	function handleRemovePlayer(player: User) {
		function isNotUserToRemove(userToRemove: User) {
			return player.username !== userToRemove.username;
		}
		setPlayers(players.filter(isNotUserToRemove));
	}

	async function startGame() {
		await firebaseService.createGame(user, players).then(game => {
			dispatch(setGame(game));
		});
		history.push('/Table');
	}

	// async function createGroup() {
	// 	await firebaseService.createGroup(user, groupName, players);
	// }

	let markup = (
		<div className="main">
			<Typography variant="h6">Create a new game</Typography>
			{/* <GroupSearchForm /> */}
			<UserSearchForm />
			<br></br>
			<Typography variant="subtitle1">Players:</Typography>
			<List
				component="div"
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '120px',
					marginBottom: '10px'
				}}
			>
				{user &&
					players.length > 0 &&
					players.map(player => {
						return player ? (
							<ListItem key={player.id} style={{ padding: 0, height: '35px' }}>
								<ListItemText primary={player.username || ''} />
								{player.username === user.username ? (
									<IconButton color="primary" disabled={true}>
										<MoodIcon />
									</IconButton>
								) : (
									<IconButton color="primary" onClick={() => handleRemovePlayer(player)}>
										<ClearIcon />
									</IconButton>
								)}
							</ListItem>
						) : null;
					})}
			</List>
			<Button size="small" variant="outlined" onClick={startGame} disabled={players.length < 4}>
				Start game
			</Button>
			<br></br>
			{/* {groupNameInput ? (
				<div>
					<TextField
						label="Group name"
						value={groupName}
						onChange={e => {
							setGroupName(e.target.value);
						}}
					/>
					<Button size="small" variant="outlined" onClick={createGroup} disabled={players.length < 4}>
						Create group
					</Button>
				</div>
			) : (
				<Button
					size="small"
					variant="outlined"
					onClick={() => {
						setGroupNameInput(true);
					}}
					disabled={players.length < 4}
				>
					New group
				</Button>
			)}
			<br></br> */}
			<HomeButton />
		</div>
	);

	return user ? markup : <Login />;
};

export default NewGame;
