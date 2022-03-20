import { Alert, Collapse, TextField } from '@mui/material';
import 'App.scss';
import { AlertStatus, DisallowedUsernames, Page, Status, Transition } from 'enums';
import { AppContext } from 'hooks';
import { ErrorMessage, InfoMessage } from 'messages';
import { User } from 'models';
import { HomePage } from 'pages';
import { isDev } from 'platform';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText, HomeScreenText } from 'screenTexts';
import { ServiceInstance } from 'service';
import { IStore } from 'store';
import { Row } from 'style/StyledComponents';
import { StyledButton } from 'style/StyledMui';

const NewUser = () => {
	const { alert, login, logout, navigate, setAlert, userEmail } =
		useContext(AppContext);
	const { user } = useSelector((state: IStore) => state);
	const [toDeleteIfUnload, setToDeleteIfUnload] = useState(true);
	const [username, setUsername] = useState('');
	const checkAuthTimeoutRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		clearTimeout(checkAuthTimeoutRef.current);
		checkAuthTimeoutRef.current = setTimeout(async () => {
			// If failed to FB login user, push to login page. If user is logged in, push to Home page
			const isFBAuthenticated = await ServiceInstance.FBAuthenticated();
			if (!isFBAuthenticated) {
				navigate(Page.LOGIN);
			} else if (user?.uN) {
				navigate(Page.HOME);
			}
		}, 500);
	}, [navigate, user?.uN]);

	// If user ends session before setting username, delete records of email from DB to preserve email availability
	useEffect(() => {
		window.onbeforeunload = () => {
			if (toDeleteIfUnload) {
				ServiceInstance.FBDeleteCurrentFBUser();
			}
		};

		return () => {
			window.onbeforeunload = null;
		};
	}, [toDeleteIfUnload]);

	function cancelRegister() {
		setAlert(null);
		ServiceInstance.FBDeleteCurrentFBUser();
		logout();
		navigate(Page.LOGIN);
	}

	function registerNewUsername(values: IEmailUser, callback: () => void) {
		const disallowed = DisallowedUsernames.find(u =>
			username.toLowerCase().startsWith(u)
		);
		if (!!disallowed && !isDev) {
			setAlert({
				status: Status.ERROR,
				msg: `${ErrorMessage.USERNAME_NOT_ALLOWED} '${disallowed}'`
			});
		} else {
			ServiceInstance.FBNewUsername(values)
				.then(res => {
					if (res) {
						setAlert({
							status: Status.SUCCESS,
							msg: InfoMessage.REGISTER_SUCCESS
						});
						callback();
					}
				})
				.catch(err => {
					setAlert({ status: Status.ERROR, msg: err.message });
				});
		}
	}

	function registerSuccessCallback() {
		setToDeleteIfUnload(false);
		ServiceInstance.FBResolveUser(userEmail)
			.then((user: User) => {
				login(user, true);
				setTimeout(function () {
					navigate(Page.HOME);
					setAlert(null);
				}, 1000);
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.message });
			});
	}

	const markup = () => (
		<>
			<TextField
				inputProps={{ maxLength: 8 }}
				label={HomeScreenText.USERNAME}
				onChange={e => setUsername(e.target.value.toLowerCase())}
				style={{ margin: '-5px 0px 5px', width: '160px' }}
				type="text"
				value={username}
				variant="standard"
			/>
			<Row
				style={{
					minHeight: '10px',
					width: '180px',
					justifyContent: 'space-between'
				}}
			>
				{alert?.status !== Status.SUCCESS && (
					<>
						<StyledButton label="Cancel" onClick={cancelRegister} />
						<StyledButton
							label={ButtonText.SUBMIT}
							autoFocus
							type="submit"
							disabled={username.trim() === ''}
							onClick={() => {
								registerNewUsername(
									{ email: userEmail, uN: username },
									registerSuccessCallback
								);
							}}
						/>
					</>
				)}
			</Row>
			<Collapse in={!!alert} timeout={Transition.FAST} unmountOnExit>
				<Alert severity={alert?.status as AlertStatus}>{alert?.msg}</Alert>
			</Collapse>
		</>
	);

	return (
		<HomePage
			markup={markup}
			title={HomeScreenText.NEW_USER_TITLE}
			timeout={2500}
			skipVerification
			misc={3}
		/>
	);
};

export default NewUser;
