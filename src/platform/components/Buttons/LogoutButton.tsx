import { history } from 'App';
import { StyledButton } from 'platform/style/StyledMui';
import React, { useContext } from 'react';
import { Page } from 'shared/enums';
import { AppContext } from 'shared/hooks';

const LogoutButton = () => {
	const { logout } = useContext(AppContext);

	function handleLogout() {
		logout();
		history.push(Page.LOGIN);
	}

	return <StyledButton label={'Logout'} onClick={handleLogout} />;
};

export default LogoutButton;
