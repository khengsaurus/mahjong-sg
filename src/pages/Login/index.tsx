import { useState } from 'react';
import LoginForm from '../../components/FormComponents/LoginForm';
import RegisterForm from '../../components/FormComponents/RegisterForm';
import { Main, StyledButton } from '../../global/StyledComponents';
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
			<StyledButton
				label={showRegister ? `Back to login` : `Register now`}
				padding="0px"
				onClick={() => {
					setShowRegister(!showRegister);
				}}
			/>
		</Main>
	);

	return markup;
};

export default Login;
