import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useContext, useState } from 'react';
import { Page, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { FBAuthLogin_EmailPass, FBAuthRegister_EmailPass, FBResolveUser_Email } from 'shared/service/fbUserFns';
import './login.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function clearForm() {
		setEmail('');
		setPassword('');
	}

	const handleLogin = useCallback(
		(values: IEmailPass, callback?: () => void) => {
			FBAuthLogin_EmailPass(values)
				.then(email => {
					if (email === values.email) {
						setUserEmail(email);
						FBResolveUser_Email(email)
							.then(user => {
								setAlert(null);
								if (user) {
									callback();
									login(user, false);
									history.push(Page.INDEX);
								} else {
									// User not registered, redirect to NewUser
									history.push(Page.NEWUSER);
								}
							})
							.catch(err => {
								console.error(err);
							});
					} else {
						// Auth login failed
					}
				})
				.catch(err => {
					setAlert({ status: Status.ERROR, msg: err.toString() });
				});
		},
		[login, setAlert, setUserEmail]
	);

	const handleRegister = useCallback(
		(values: IEmailPass, callback?: () => void) => {
			FBAuthRegister_EmailPass(values)
				.then(res => {
					if (res) {
						setAlert(null);
						callback();
						handleLogin(values);
					}
				})
				.catch(err => {
					setAlert({ status: Status.ERROR, msg: err.toString() });
				});
		},
		[handleLogin, setAlert]
	);

	return (
		<HomeTheme>
			<Main>
				<Centered>
					<TextField
						key="email"
						label="Email"
						type="text"
						value={email}
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
					<br></br>
					<TextField
						key="password"
						label="Password"
						type="password"
						value={password}
						onChange={e => {
							setPassword(e.target.value);
						}}
					/>
					<br></br>
					<StyledButton
						label={showRegister ? `Register` : `Login`}
						type="submit"
						autoFocus
						disabled={email.trim() === '' || password.trim() === ''}
						onClick={() =>
							showRegister
								? handleRegister({ email, password }, clearForm)
								: handleLogin({ email, password }, clearForm)
						}
					/>
					<StyledButton
						label={showRegister ? `Back to login` : `Register now`}
						onClick={() => {
							setAlert(null);
							setShowRegister(!showRegister);
						}}
					/>
					{alert && (
						<>
							<br></br>
							<Alert severity={alert.status as 'success' | 'info' | 'warning' | 'error'}>
								{alert.msg}
							</Alert>
						</>
					)}
				</Centered>
			</Main>
		</HomeTheme>
	);
};

export default Login;
