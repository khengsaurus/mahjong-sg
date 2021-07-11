import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import './login.scss';

const Login: React.FC = () => {
	const [showRegister, setShowRegister] = useState(false);
	const markup = (
		<div className="login-panel">
			{showRegister ? (
				<div>
					<RegisterForm />
				</div>
			) : (
				<div>
					<LoginForm />
				</div>
			)}
			<Button
				variant="outlined"
				onClick={() => {
					setShowRegister(!showRegister);
				}}
			>
				{showRegister ? 'Back to login' : 'Register now'}
			</Button>
		</div>
	);

	return markup;
};

export default Login;
