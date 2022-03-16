import { StyledButton } from 'style/StyledMui';
import React, { useContext } from 'react';
import { Page } from 'enums';
import { AppContext } from 'hooks';

const LogoutButton = () => {
	const { logout, navigate } = useContext(AppContext);

	function handleLogout() {
		logout();
		navigate(Page.LOGIN);
	}

	return <StyledButton label={'Logout'} onClick={handleLogout} />;
};

export default LogoutButton;
