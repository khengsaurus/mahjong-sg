import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main, Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useCallback, useEffect, useContext, useState } from 'react';
import { Page, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { FBAuthLogin_EmailPass, FBAuthRegister_EmailPass, FBResolveUser_Email } from 'shared/service/fbUserFns';
import './login.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	useEffect(() => {
		setConfirmPassword('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showRegister]);

	function clearForm() {
		setEmail('');
		setPassword('');
		setConfirmPassword('');
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
			if (values.password === confirmPassword) {
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
			} else {
				setAlert({ status: Status.ERROR, msg: 'Passwords do not match' });
			}
		},
		[confirmPassword, handleLogin, setAlert]
	);

	const handleSubmit = useCallback(() => {
		if (email.trim() !== '' && password.trim() !== '') {
			showRegister ? handleRegister({ email, password }, clearForm) : handleLogin({ email, password }, clearForm);
		}
	}, [email, handleLogin, handleRegister, password, showRegister]);

	const enterListener = useCallback(
		e => {
			if (e.key === 'Enter') {
				handleSubmit();
			}
		},
		[handleSubmit]
	);

	useEffect(() => {
		window.addEventListener('keypress', enterListener);
		return () => {
			window.removeEventListener('keypress', enterListener);
		};
	}, [enterListener]);

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
						style={{ margin: '5px 0' }}
					/>
					<TextField
						key="password"
						label="Password"
						type="password"
						value={password}
						onChange={e => {
							setPassword(e.target.value);
						}}
						style={{ margin: '5px 0' }}
					/>
					<Collapse in={showRegister} timeout={300} unmountOnExit>
						<TextField
							key="confirmPassword"
							label="Confirm password"
							type="password"
							value={confirmPassword}
							onChange={e => {
								setConfirmPassword(e.target.value);
							}}
							style={{ margin: '5px 0' }}
						/>
					</Collapse>
					<Row>
						<StyledButton
							label={showRegister ? `Back` : `Register now`}
							onClick={() => {
								setAlert(null);
								setShowRegister(!showRegister);
							}}
						/>
						<StyledButton
							label={showRegister ? `Register` : `Login`}
							type="submit"
							autoFocus
							disabled={
								email.trim() === '' ||
								password.trim() === '' ||
								(showRegister && confirmPassword.trim() === '')
							}
							onClick={handleSubmit}
						/>
					</Row>
					<Collapse in={!!alert} timeout={300} unmountOnExit>
						<Alert severity={alert?.status as 'success' | 'info' | 'warning' | 'error'}>
							{showRegister ? alert?.msg : 'Please try again'}
						</Alert>
					</Collapse>
				</Centered>
			</Main>
		</HomeTheme>
	);
};

export default Login;
