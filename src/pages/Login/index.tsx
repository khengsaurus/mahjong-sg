import Button from '@material-ui/core/Button';
import { useState } from 'react';
import LoginForm from '../../components/FormComponents/LoginForm';
import RegisterForm from '../../components/FormComponents/RegisterForm';
import './Login.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);

	const markup = (
		<div className="main">
			<>
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
					{showRegister ? `Back to login` : `Register now`}
				</Button>
			</>
		</div>
	);

	return markup;
};

export default Login;
