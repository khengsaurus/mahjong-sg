import { Alert, Collapse, TextField } from '@mui/material';
import { DecorButton, PlayAIButton } from 'components';
import { adminUsers, AlertStatus, EEvent, Page, Status, Transition } from 'enums';
import { AppContext, useWindowListener } from 'hooks';
import { ErrorMessage } from 'messages';
import { HomePage } from 'pages';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ButtonText, HomeScreenText } from 'screenTexts';
import { ServiceInstance } from 'service';
import { Row } from 'style/StyledComponents';
import { StyledButton } from 'style/StyledMui';
import { IAlert } from 'typesPlus';
import { isEmail } from 'utility';

const Login = () => {
	const { login, navigate, setUserEmail } = useContext(AppContext);
	const [alert, setAlert] = useState<IAlert>(null);
	const [ready, setReady] = useState(true);
	const [email, setEmail] = useState('');
	const [usernameEmail, setUsernameEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showRegister, setShowRegister] = useState(false);

	useEffect(() => {
		setConfirmPassword('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showRegister]);

	const loginDisabled = useMemo(
		() => usernameEmail.trim() === '' || password.trim() === '',
		[usernameEmail, password]
	);

	const registerDisabled = useMemo(
		() =>
			email.trim() === '' ||
			password.trim() === '' ||
			confirmPassword.trim() === '',
		[email, password, confirmPassword]
	);

	function clearForm() {
		setUsernameEmail('');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
	}

	const handleError = useCallback(
		(err: Error) => {
			setReady(true);
			if (err.message?.toUpperCase().includes(ErrorMessage.FIREBASE_WRONG_PW)) {
				setAlert({ status: Status.ERROR, msg: ErrorMessage.LOGIN_ERROR });
			} else {
				setAlert({ status: Status.ERROR, msg: err.message });
			}
		},
		[setReady, setAlert]
	);

	const handleLogin = useCallback(async () => {
		if (!showRegister && usernameEmail.trim() && password.trim()) {
			setReady(false);
			let email;
			if (isEmail(usernameEmail)) {
				email = usernameEmail;
			} else {
				await ServiceInstance.getEmailFromUsername(usernameEmail)
					.then(e => (email = e))
					.catch(err => {
						setAlert({ status: Status.ERROR, msg: err.message });
						setReady(true);
						return;
					});
			}
			if (email) {
				ServiceInstance.FBAuthLogin({ email, password })
					.then(e => ServiceInstance.FBResolveUser(e))
					.then(user => {
						setReady(true);
						setAlert(null);
						if (user) {
							clearForm();
							login(user, false);
							if (adminUsers.includes(user.uN)) {
								// use admin login to cleanup old games since users may not login a second time
								ServiceInstance.cleanupAllGames();
							} else {
								user?.email && ServiceInstance.cleanupGames(user.email);
							}
							setReady(true);
							navigate(Page.INDEX);
						} else {
							throw new Error(ErrorMessage.REGISTER_ISSUE);
						}
					})
					.catch(err => handleError(err));
			}
		}
	}, [handleError, login, navigate, password, showRegister, setAlert, usernameEmail]);

	const handleRegister = useCallback(() => {
		if (showRegister && email.trim() && password.trim() && confirmPassword.trim()) {
			if (password === confirmPassword) {
				setReady(false);
				ServiceInstance.FBAuthRegister({ email, password })
					.then(res => {
						if (res) {
							setUserEmail(email);
							clearForm();
							setAlert(null);
							setReady(true);
							navigate(Page.NEWUSER);
						}
					})
					.catch(err => {
						setReady(true);
						setAlert({ status: Status.ERROR, msg: err.message });
					});
			} else {
				setAlert({ status: Status.ERROR, msg: ErrorMessage.PW_NOT_MATCHING });
			}
		}
	}, [
		confirmPassword,
		email,
		navigate,
		password,
		setAlert,
		setUserEmail,
		showRegister
	]);

	const enterListener = useCallback(
		e => {
			if (e.key === 'Enter') {
				showRegister ? handleRegister() : handleLogin();
			}
		},
		[showRegister, handleRegister, handleLogin]
	);
	useWindowListener(EEvent.KEYPRESS, enterListener);

	const renderLoginButton = () => (
		<StyledButton
			label={ButtonText.LOGIN}
			type="submit"
			autoFocus
			disabled={loginDisabled}
			onClick={handleLogin}
		/>
	);

	const renderRegisterButton = () => (
		<StyledButton
			label={ButtonText.REGISTER}
			type="submit"
			autoFocus
			disabled={registerDisabled}
			onClick={handleRegister}
		/>
	);

	const markup = () => (
		<>
			<TextField
				key="usernameEmail"
				label={
					showRegister ? HomeScreenText.EMAIL : HomeScreenText.USERNAME_EMAIL
				}
				onChange={e =>
					showRegister
						? setEmail(e.target.value?.toLowerCase())
						: setUsernameEmail(e.target.value?.toLowerCase())
				}
				style={{ margin: '-5px 0px 0px', width: '160px' }}
				type="text"
				value={showRegister ? email : usernameEmail}
				variant="standard"
			/>
			<TextField
				key="password"
				label={HomeScreenText.PW}
				onChange={e => setPassword(e.target.value)}
				style={{ margin: '5px 0', width: '160px' }}
				type="password"
				value={password}
				variant="standard"
			/>
			<Collapse in={showRegister} timeout={Transition.FAST} unmountOnExit>
				<TextField
					key="confirmPassword"
					label={HomeScreenText.C_PW}
					onChange={e => setConfirmPassword(e.target.value)}
					style={{ margin: '5px 0', width: '160px' }}
					type="password"
					value={confirmPassword}
					variant="standard"
				/>
			</Collapse>
			<Row
				style={{ paddingTop: 5, justifyContent: 'space-between', width: '180px' }}
			>
				<StyledButton
					label={showRegister ? ButtonText.BACK : ButtonText.REGISTER}
					onClick={() => {
						setAlert(null);
						clearForm();
						setShowRegister(!showRegister);
					}}
				/>
				{showRegister ? renderRegisterButton() : renderLoginButton()}
			</Row>
			<Row style={{ justifyContent: 'center', marginTop: -5 }}>
				<DecorButton Button={PlayAIButton} showOnHover={['we', '', 'wn']} />
			</Row>
			<Collapse
				in={!!alert}
				timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }}
				unmountOnExit
			>
				<Alert severity={alert?.status as AlertStatus}>
					{alert?.msg || ErrorMessage.TRY_AGAIN}
				</Alert>
			</Collapse>
		</>
	);

	return (
		<HomePage
			markup={markup}
			title={HomeScreenText.HOME_TITLE}
			ready={ready}
			timeout={5000}
			skipVerification
		/>
	);
};

export default Login;
