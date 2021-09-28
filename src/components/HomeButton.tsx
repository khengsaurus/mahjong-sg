import { Pages } from '../global/enums';
import { StyledButton } from '../global/StyledComponents';

const HomeButton = () => {
	return <StyledButton title="Home" navigate={Pages.index} />;
};
export default HomeButton;
