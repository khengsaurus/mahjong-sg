import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContext, useEffect } from 'react';
import { history } from '../../App';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './home.scss';

const Home = () => {
	const { user, validateJWT, logout } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			validateJWT();
		}
	}, [user, validateJWT]);

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
