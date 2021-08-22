import { Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import GoogleButton from 'react-google-button';
import { history } from '../../App';
import LoginForm from '../../components/Forms/LoginForm';
import RegisterForm from '../../components/Forms/RegisterForm';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import './Login.scss';

const Login = () => {
	const { login, setUserEmail } = useContext(AppContext);
	const [showRegister, setShowRegister] = useState(false);

	async function loginWithGoogle() {
		await FBService.authLoginWithGoogle().then((email: string) => {
			setUserEmail(email);
			resolveUser_Email(email)
				.then((user: User) => {
					if (user) {
						login(user);
					} else {
						history.push('/NewUser');
					}
				})
				.catch((err: Error) => {
					console.log(err);
				});
		});
	}

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
				<br></br>
				<GoogleButton onClick={loginWithGoogle} type={'light'} />
			</>
		</div>
	);

	return markup;
};

export default Login;
