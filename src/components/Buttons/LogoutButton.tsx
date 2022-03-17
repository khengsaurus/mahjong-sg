import { Page } from 'enums';
import { AppContext } from 'hooks';
import { useContext } from 'react';
import { StyledButton } from 'style/StyledMui';

const LogoutButton = () => {
	const { logout, navigate } = useContext(AppContext);

	function handleLogout() {
		logout();
		navigate(Page.LOGIN);
	}

	return <StyledButton label={'Logout'} onClick={handleLogout} />;
};

export default LogoutButton;
