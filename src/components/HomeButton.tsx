import Button from '@material-ui/core/Button';
import { history } from '../App';
import { Pages } from '../Globals';

const HomeButton = () => {
	function handleGoHome() {
		history.push(Pages.index);
	}
	return (
		<Button size="small" variant="outlined" onClick={handleGoHome}>
			Home
		</Button>
	);
};
export default HomeButton;
