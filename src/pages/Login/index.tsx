import { Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import GoogleButton from 'react-google-button';
import LoginForm from '../../components/Forms/LoginForm';
import RegisterForm from '../../components/Forms/RegisterForm';
import RegisterWithGoogleForm from '../../components/Forms/RegisterWithGoogleForm';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { attemptLoginByEmail } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import './Login.scss';

const Login: React.FC = () => {
	const { login, setUserEmail } = useContext(AppContext);
	const [showRegister, setShowRegister] = useState(false);
	const [showRegisterWithEmail, setShowRegisterWithEmail] = useState(false);
	const [refuseEmail, setRefuseEmail] = useState(false);

	async function loginWithGoogle() {
		await FBService.loginWithGoogle().then((email: string) => {
			setUserEmail(email);
			attemptLoginByEmail(email)
				.then((user: User) => {
					login(user);
				})
				.catch((err: Error) => {
					if (err.message === 'Email not registered -> RegisterWithGoogleForm') {
						setShowRegisterWithEmail(true);
					} else {
						console.log(err);
					}
				});
		});
	}

	const userPassLoginMarkup = (
		<div className="main">
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
			<Button
				variant="outlined"
				onClick={() => {
					setShowRegister(false);
					setRefuseEmail(false);
				}}
			>
				{`Back`}
			</Button>
		</div>
	);

	const emailLoginMarkup = (
		<div className="main">
			{showRegisterWithEmail ? (
				<div>
					<RegisterWithGoogleForm
						onCancel={() => {
							setShowRegisterWithEmail(false);
						}}
					/>
				</div>
			) : (
				<>
					<GoogleButton onClick={loginWithGoogle} type={'light'} />
					{refuseEmail ? (
						userPassLoginMarkup
					) : (
						<>
							<br></br>
							<Button
								variant="outlined"
								onClick={() => {
									setRefuseEmail(true);
								}}
							>
								{'Nah'}
							</Button>
						</>
					)}
				</>
			)}
		</div>
	);

	return emailLoginMarkup;
};

export default Login;
