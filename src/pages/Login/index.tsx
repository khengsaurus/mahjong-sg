import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import LoginForm from '../../components/Forms/LoginForm';
import RegisterForm from '../../components/Forms/RegisterForm';
import './Login.scss';

const Login: React.FC = () => {
	const [showRegister, setShowRegister] = useState(false);
	const markup = (
		<div className="main">
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
		</div>
	);

	return markup;
};

export default Login;
