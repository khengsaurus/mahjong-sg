import Alert from '@material-ui/lab/Alert';
import { Collapse, TextField } from '@mui/material';
import { history } from 'App';
import 'App.scss';
import HomePage from 'platform/pages/Home/HomePage';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useContext, useEffect, useState } from 'react';
import { AlertStatus, Page, Status, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { InfoMessage } from 'shared/messages';
import { User } from 'shared/models';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);
	const [toDeleteIfUnload, setToDeleteIfUnload] = useState(true);
	const [username, setUsername] = useState('');

	useEffect(() => {
		if (!ServiceInstance.FBAuthenticated()) {
			history.push(Page.LOGIN);
		}
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
			<StyledText title={HomeScreenText.NEW_USER_TITLE} />
			<TextField
				name="username"
				label={HomeScreenText.USERNAME}
				onChange={e => {
					setUsername(e.target.value);
				}}
				inputProps={{ maxLength: 10 }}
				variant="standard"
				style={{ margin: '-3px 0 5px' }}
			/>
			<Row style={{ width: '80%', justifyContent: 'space-evenly' }}>
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
				<>
					<br />
					<Alert severity={alert?.status as AlertStatus}>{alert?.msg}</Alert>
				</>
			</Collapse>
		</>
	);

	return <HomePage markup={markup} timeout={2500} skipVerification />;
};

export default NewUser;
