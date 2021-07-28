import { Button, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { history } from '../../App';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './Home.scss';

const Home = () => {
	const { user, validateJWT, logout } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			validateJWT();
		}
	}, [user]);

	let markup = (
		<div className="main">
			{user && <Typography variant="h6">{`Welcome ${user.username}`}</Typography>}
			<br></br>
			<Button variant={'outlined'} onClick={() => history.push('/NewGame')}>
				New game
			</Button>
			<br></br>
			<Button variant={'outlined'} onClick={() => history.push('/JoinGame')}>
				Join game
			</Button>
			<br></br>
			<Button variant={'outlined'} onClick={logout}>
				Logout
			</Button>
		</div>
	);

	return user ? markup : <Login />;
};

export default Home;
