import Button from '@material-ui/core/Button';
import { history } from '../App';

const HomeButton = () => {
	function handleGoHome() {
		history.push('/');
	}
	return (
		<Button size="small" variant="outlined" onClick={handleGoHome}>
			Home
		</Button>
	);
};
export default HomeButton;
