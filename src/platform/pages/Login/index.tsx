import Alert from '@material-ui/lab/Alert';
import { Collapse, TextField } from '@mui/material';
import { history } from 'App';
import PlayAIButton from 'platform/components/Buttons/PlayAIButton';
import { AboutButton, PrivacyButton } from 'platform/components/Buttons/TextNavButton';
import { useAndroidKeyboardListener, useWindowListener } from 'platform/hooks';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { BottomSpec, Row } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AlertStatus, EEvent, Page, Status, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ErrorMessage } from 'shared/messages';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';

const Login = () => {
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);
	const { showBottom } = useAndroidKeyboardListener();
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
		setUsername('');
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

	const handleLogin = useCallback(() => {
		if (!showRegister && username.trim() !== '' && password.trim() !== '') {
			setReady(false);
			ServiceInstance.getEmailFromUsername(username)
				.then(email => ServiceInstance.FBAuthLogin({ email, password }))
				.then(_email => ServiceInstance.FBResolveUser(_email))
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
						throw new Error(ErrorMessage.REGISTER_ISSUE);
					}
				})
				.catch(err => {
					handleError(err);
				});
		}
	}, [showRegister, username, password, login, setAlert, handleError]);

	const handleRegister = useCallback(() => {
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
						setAlert({ status: Status.ERROR, msg: err.message });
					});
			} else {
				setAlert({ status: Status.ERROR, msg: ErrorMessage.PW_NOT_MATCHING });
			}
		}
	}, [confirmPassword, email, password, setAlert, setUserEmail, showRegister]);

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
		<StyledButton label={ButtonText.LOGIN} type="submit" autoFocus disabled={loginDisabled} onClick={handleLogin} />
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
			<StyledText title={HomeScreenText.HOME_TITLE} padding="0" />
			<TextField
				key="usernameEmail"
				label={showRegister ? HomeScreenText.EMAIL : HomeScreenText.USERNAME}
				type="text"
				value={showRegister ? email : username}
				onChange={e => {
					showRegister ? setEmail(e.target.value) : setUsername(e.target.value);
				}}
				variant="standard"
				style={{ margin: '5px 0', width: '160px' }}
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
				style={{ margin: '5px 0', width: '160px' }}
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
					style={{ margin: '5px 0', width: '160px' }}
				/>
			</Collapse>
			<Row style={{ paddingTop: 5, justifyContent: 'space-between', width: '180px' }}>
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
				<PlayAIButton />
			</Row>
			{showBottom && (
				<BottomSpec style={{ marginRight: -5 }}>
					<PrivacyButton />
					<AboutButton />
				</BottomSpec>
			)}
			<Collapse in={!!alert} timeout={{ enter: Transition.FAST, exit: Transition.INSTANT }} unmountOnExit>
				<>
					<br />
					<Alert severity={alert?.status as AlertStatus}>{alert?.msg || ErrorMessage.TRY_AGAIN}</Alert>
				</>
			</Collapse>
		</>
	);

	return <HomePage markup={markup} timeout={2500} ready={ready} skipVerification />;
};

export default Login;
