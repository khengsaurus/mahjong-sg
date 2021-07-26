import { Button } from '@material-ui/core';
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
