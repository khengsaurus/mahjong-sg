import { Button } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { history } from '../../App';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './home.scss';

const Home = () => {
	const { user, authToken, validateJWT, logout } = useContext(AppContext);

	useEffect(() => {
		validateJWT();
	}, [user, validateJWT]);

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
			<br></br>
			<Button
				variant={'outlined'}
				onClick={() => {
					console.log(user);
					console.log(authToken);
				}}
			>
				Log user
			</Button>
		</div>
	);
	return user ? markup : <Login />;
};

export default Home;
