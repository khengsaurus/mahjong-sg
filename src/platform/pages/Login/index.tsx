import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Page, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { FBAuthLogin_EmailPass, FBAuthRegister_EmailPass, FBResolveUser_Email } from 'shared/service/fbUserFns';
import HomePage from '../Home/HomePage';
import './login.scss';

const Login = () => {
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);
	const [ready, setReady] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showRegister, setShowRegister] = useState(false);
	// const [offsetKeyboard, setOffsetKeyboard] = useState(44.5);

	useEffect(() => {
		setConfirmPassword('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showRegister]);

	// useEffect(() => {
	// 	const buttonsHeight = document.getElementById('bottom-btns')?.getBoundingClientRect()?.height;
	// 	setOffsetKeyboard(buttonsHeight);
	// }, []);

	const loginDisabled = useMemo(() => email.trim() === '' || password.trim() === '', [email, password]);

	const registerDisabled = useMemo(
		() => email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '',
		[email, password, confirmPassword]
	);

	function clearForm() {
		setEmail('');
		setPassword('');
		setConfirmPassword('');
	}

	const handleLogin = useCallback(
		(values: IEmailPass, callback?: () => void) => {
			setReady(false);
			FBAuthLogin_EmailPass(values)
				.then(email => {
					if (email === values.email) {
						setUserEmail(email);
						FBResolveUser_Email(email)
							.then(user => {
								setReady(true);
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
								setReady(true);
								setAlert({ status: Status.ERROR, msg: err.msg });
							});
					} else {
						// Auth login failed
					}
				})
				.catch(err => {
					setAlert({ status: Status.ERROR, msg: err.msg });
				});
		},
		[login, setAlert, setUserEmail]
	);

	const handleRegister = useCallback(
		(values: IEmailPass, callback?: () => void) => {
			if (values.password === confirmPassword) {
				setReady(false);
				FBAuthRegister_EmailPass(values)
					.then(res => {
						if (res) {
							setReady(true);
							setAlert(null);
							callback();
							handleLogin(values);
						}
					})
					.catch(err => {
						setReady(true);
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

	const renderLoginButton = () => (
		<StyledButton label={`Login`} type="submit" autoFocus disabled={loginDisabled} onClick={handleSubmit} />
	);

	const renderRegisterButton = () => (
		<StyledButton label={`Register`} type="submit" autoFocus disabled={registerDisabled} onClick={handleSubmit} />
	);

	const markup = () => (
		<>
			<Title title={`Welcome to Mahjong SG!`} />
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
			<Row style={{ paddingTop: 10, width: '100%', justifyContent: 'space-evenly' }} id="bottom-btns">
				<StyledButton
					label={showRegister ? `Back` : `Register`}
					onClick={() => {
						setAlert(null);
						setShowRegister(!showRegister);
					}}
				/>
				{showRegister ? renderRegisterButton() : renderLoginButton()}
			</Row>
			<Collapse in={!!alert} timeout={300} unmountOnExit>
				<Alert severity={alert?.status as 'success' | 'info' | 'warning' | 'error'}>
					{showRegister ? alert?.msg : 'Please try again'}
				</Alert>
			</Collapse>
		</>
	);

	return (
		<HomePage markup={markup} timeout={2500} ready={ready} skipVerification /> // offset={offsetKeyboard + 10}
	);
};

export default Login;
