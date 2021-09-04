import Button from '@material-ui/core/Button';
import { useState } from 'react';
import LoginForm from '../../components/FormComponents/LoginForm';
import RegisterForm from '../../components/FormComponents/RegisterForm';
import { Main } from '../../global/styles';
import './login.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);

	const markup = (
		<Main>
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
		</Main>
	);

	return markup;
};

export default Login;
