import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContext, useEffect } from 'react';
import { history } from '../../App';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main } from '../../global/StyledComponents';
import { AppContext } from '../../util/hooks/AppContext';
import Login from '../Login';
import './home.scss';

const Home = () => {
	const { user, handleUserState, logout, mainTextColor } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let markup = (
		<HomeTheme>
			<Main>
				{user && (
					<Typography style={{ color: mainTextColor }} variant="h6">{`Welcome ${user.username}`}</Typography>
				)}
				<br></br>
				<Button variant={'text'} onClick={() => history.push(Pages.newGame)}>
					New game
				</Button>
				<br></br>
				<Button variant={'text'} onClick={() => history.push(Pages.joinGame)}>
					Join game
				</Button>
				<br></br>
				<Button variant={'text'} onClick={logout}>
					Logout
				</Button>
			</Main>
		</HomeTheme>
	);

	return user ? markup : <Login />;
};

export default Home;
