import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContext, useEffect } from 'react';
import { history } from '../../App';
import { Pages } from '../../Globals';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './home.scss';

const Home = () => {
	const { user, handleUserState, logout } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let markup = (
		<div className="main">
			{user && <Typography variant="h6">{`Welcome ${user.username}`}</Typography>}
			<br></br>
			<Button variant={'outlined'} onClick={() => history.push(Pages.newGame)}>
				New game
			</Button>
			<br></br>
			<Button variant={'outlined'} onClick={() => history.push(Pages.joinGame)}>
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
