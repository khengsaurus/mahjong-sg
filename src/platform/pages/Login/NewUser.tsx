import { Alert, Collapse, TextField } from '@mui/material';
import { history } from 'App';
import 'App.scss';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useContext, useEffect, useRef, useState } from 'react';
import { AlertStatus, DisallowedUsernames, Page, Status, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { ErrorMessage, InfoMessage } from 'shared/messages';
import { User } from 'shared/models';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { isDev } from 'shared/util';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);
	const [toDeleteIfUnload, setToDeleteIfUnload] = useState(true);
	const [username, setUsername] = useState('');
	const checkAuthTimeoutRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		clearTimeout(checkAuthTimeoutRef.current);
		checkAuthTimeoutRef.current = setTimeout(async () => {
			if (await !ServiceInstance.FBAuthenticated()) {
				history.push(Page.LOGIN);
			}
		}, 500);
	}, []);

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
		history.push(Page.LOGIN);
	}

	function registerNewUsername(values: IEmailUser, callback: () => void) {
		const disallowed = DisallowedUsernames.find(u => username.toLowerCase().startsWith(u));
		if (!!disallowed && !isDev()) {
			setAlert({ status: Status.ERROR, msg: `${ErrorMessage.USERNAME_NOT_ALLOWED} '${disallowed}'` });
		} else {
			ServiceInstance.FBNewUsername(values)
				.then(res => {
					if (res) {
						setAlert({ status: Status.SUCCESS, msg: InfoMessage.REGISTER_SUCCESS });
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
					history.push(Page.HOME);
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
				style={{ margin: '-5px 0px 5px', width: '150px' }}
				type="text"
				value={username}
				variant="standard"
			/>
			<Row style={{ width: '170px', justifyContent: 'space-between' }}>
				{alert?.status !== Status.SUCCESS && (
					<>
						<StyledButton label="Cancel" onClick={cancelRegister} />
						<StyledButton
							label={ButtonText.SUBMIT}
							autoFocus
							type="submit"
							disabled={username.trim() === ''}
							onClick={() => {
								registerNewUsername({ email: userEmail, uN: username }, registerSuccessCallback);
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

	return <HomePage markup={markup} title={HomeScreenText.NEW_USER_TITLE} timeout={2500} skipVerification misc={3} />;
};

export default NewUser;
