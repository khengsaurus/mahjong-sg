import Button from '@material-ui/core/Button';
import { history } from '../App';
import { Pages } from '../global/enums';

const HomeButton = () => {
	function handleGoHome() {
		history.push(Pages.index);
	}
	return (
		<Button size="medium" variant="text" onClick={handleGoHome}>
			Home
		</Button>
	);
};
export default HomeButton;
