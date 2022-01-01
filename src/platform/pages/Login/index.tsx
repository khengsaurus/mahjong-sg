import Alert from '@material-ui/lab/Alert';
import { Collapse, TextField } from '@mui/material';
import { history } from 'App';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Page, Status, Transition } from 'shared/enums';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { AppContext } from 'shared/hooks';
import { ErrorMessage } from 'shared/messages';
import './login.scss';
import { AboutButton } from 'platform/components/Buttons/TextNavButton';

const Login = () => {
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);
	const [ready, setReady] = useState(true);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showRegister, setShowRegister] = useState(false);

	useEffect(() => {
		setConfirmPassword('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showRegister]);

	const loginDisabled = useMemo(() => username.trim() === '' || password.trim() === '', [username, password]);

	const registerDisabled = useMemo(
		() => email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '',
		[email, password, confirmPassword]
	);

	function clearForm() {
		setEmail('');
		setPassword('');
		setConfirmPassword('');
	}

	const handleError = useCallback(
		(err: Error) => {
			console.error(err);
			setReady(true);
			setAlert({ status: Status.ERROR, msg: err.message });
		},
		[setReady, setAlert]
	);

	const handleLogin = useCallback(() => {
		if (!showRegister && username.trim() !== '' && password.trim() !== '') {
			setReady(false);
			ServiceInstance.getEmailFromUsername(username) // Get from RTDB
				.then(email => {
					ServiceInstance.FBAuthLogin({ email, password })
						.then(res => {
							if (res) {
								ServiceInstance.FBResolveUser(email)
									.then(user => {
										setReady(true);
										setAlert(null);
										if (user) {
											clearForm();
											login(user, false);
											user?.email && ServiceInstance.cleanupGames(user.email);
											setReady(true);
											history.push(Page.INDEX);
										} else {
											console.error(ErrorMessage.REGISTER_ISSUE);
										}
									})
									.catch(err => {
										handleError(err);
									});
							}
						})
						.catch(err => {
							if (err.message.toUpperCase().includes(ErrorMessage.FIREBASE_WRONG_PW)) {
								handleError(new Error(ErrorMessage.LOGIN_ERROR));
							}
						});
				})
				.catch(err => {
					handleError(err);
				});
		}
	}, [showRegister, username, password, login, setAlert, handleError]);

	const submitRegister = useCallback(() => {
		if (showRegister && email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '') {
			if (password === confirmPassword) {
				setReady(false);
				ServiceInstance.FBAuthRegister({ email, password })
					.then(res => {
						if (res) {
							setUserEmail(email);
							clearForm();
							setAlert(null);
							setReady(true);
							history.push(Page.NEWUSER);
						}
					})
					.catch(err => {
						setReady(true);
						setAlert({ status: Status.ERROR, msg: err.toString() });
					});
			} else {
				setAlert({ status: Status.ERROR, msg: ErrorMessage.PW_NOT_MATCHING });
			}
		}
	}, [confirmPassword, email, password, setAlert, setUserEmail, showRegister]);

	const enterListener = useCallback(
		e => {
			if (e.key === 'Enter') {
				showRegister ? submitRegister() : handleLogin();
			}
		},
		[showRegister, submitRegister, handleLogin]
	);

	useEffect(() => {
		window.addEventListener('keypress', enterListener);
		return () => {
			window.removeEventListener('keypress', enterListener);
		};
	}, [enterListener]);

	const renderLoginButton = () => (
		<StyledButton label={ButtonText.LOGIN} type="submit" autoFocus disabled={loginDisabled} onClick={handleLogin} />
	);

	const renderRegisterButton = () => (
		<StyledButton
			label={ButtonText.REGISTER}
			type="submit"
			autoFocus
			disabled={registerDisabled}
			onClick={submitRegister}
		/>
	);

	const markup = () => (
		<>
			<Title title={HomeScreenText.HOME_TITLE} />
			<TextField
				key="usernameEmail"
				label={showRegister ? HomeScreenText.EMAIL : HomeScreenText.USERNAME}
				type="text"
				value={showRegister ? email : username}
				onChange={e => {
					showRegister ? setEmail(e.target.value) : setUsername(e.target.value);
				}}
				variant="standard"
				style={{ margin: '5px 0' }}
			/>
			<TextField
				key="password"
				label={HomeScreenText.PW}
				type="password"
				value={password}
				onChange={e => {
					setPassword(e.target.value);
				}}
				variant="standard"
				style={{ margin: '5px 0' }}
			/>
			<Collapse in={showRegister} timeout={Transition.FAST} unmountOnExit>
				<TextField
					key="confirmPassword"
					label={HomeScreenText.C_PW}
					type="password"
					value={confirmPassword}
					onChange={e => {
						setConfirmPassword(e.target.value);
					}}
					variant="standard"
					style={{ margin: '5px 0' }}
				/>
			</Collapse>
			<Row style={{ paddingTop: 10, width: '100%', justifyContent: 'space-evenly' }} id="bottom-btns">
				<StyledButton
					label={showRegister ? ButtonText.BACK : ButtonText.REGISTER}
					onClick={() => {
						setAlert(null);
						setShowRegister(!showRegister);
					}}
				/>
				{showRegister ? renderRegisterButton() : renderLoginButton()}
			</Row>
			<Collapse in={!!alert} timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }} unmountOnExit>
				<Alert severity={alert?.status as 'success' | 'info' | 'warning' | 'error'}>
					{alert?.msg || ErrorMessage.TRY_AGAIN}
				</Alert>
			</Collapse>
			<div className="about-container">
				<AboutButton />
			</div>
		</>
	);

	return <HomePage markup={markup} timeout={2500} ready={ready} skipVerification />;
};

export default Login;
