import Alert from '@material-ui/lab/Alert';
import { Collapse, TextField } from '@mui/material';
import { history } from 'App';
import 'App.scss';
import ServiceInstance from 'platform/service/ServiceLayer';
import { Row } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useContext, useState } from 'react';
import { Page, Status, Transition } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import HomePage from '../Home/HomePage';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);
	const [username, setUsername] = useState('');

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
					setAlert({ status: Status.SUCCESS, msg: 'Registered successfully' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
				ServiceInstance.FBDeleteCurrentFBUser();
			});
	}

	function registerSuccessCallback() {
		ServiceInstance.FBResolveUser(userEmail)
			.then((user: User) => {
				login(user, true);
				setTimeout(function () {
					history.push(Page.HOME);
					setAlert(null);
				}, 1000);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: Status.ERROR, msg: err.message });
				}
			});
	}

	const markup = () => (
		<>
			<Title title={`Welcome! Choose a username`} />
			<TextField
				name="username"
				label="Username"
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
							label={`Submit`}
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
					<Alert severity={alert?.status as 'success' | 'info' | 'warning' | 'error'}>{alert?.msg}</Alert>
				</>
			</Collapse>
		</>
	);

	return <HomePage markup={markup} timeout={2500} skipVerification />;
};

export default NewUser;
