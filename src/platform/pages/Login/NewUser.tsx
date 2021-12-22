import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import 'App.scss';
import ServiceInstance from 'platform/service/ServiceLayer';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Row } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useContext, useState } from 'react';
import { Page, Status, Timeout } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);
	const [username, setUsername] = useState('');

	function handleCancel() {
		setAlert(null);
		ServiceInstance.FBDeleteCurrentFBUser();
		logout();
		history.push(Page.LOGIN);
	}

	function handleSubmit(values: IEmailUser, callback: () => void) {
		ServiceInstance.FBNewUsername(values)
			.then(res => {
				if (res) {
					setAlert({ status: Status.SUCCESS, msg: 'Registered successfully' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	function successCallback() {
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

	return (
		<HomeTheme>
			<Main>
				<Title title={`Welcome! Choose a username`} />
				<TextField
					name="username"
					label="Username"
					onChange={e => {
						setUsername(e.target.value);
					}}
					inputProps={{ maxLength: 10 }}
					style={{ margin: '-3px 0 5px' }}
				/>
				<Row>
					{alert?.status !== Status.SUCCESS ? <StyledButton label="Cancel" onClick={handleCancel} /> : null}
					<StyledButton
						label={`Submit`}
						autoFocus
						type="submit"
						disabled={username.trim() === ''}
						onClick={() => {
							handleSubmit({ email: userEmail, uN: username }, successCallback);
						}}
					/>
				</Row>
				<Collapse in={!!alert} timeout={Timeout.FAST} unmountOnExit>
					<Alert severity={alert?.status as 'success' | 'info' | 'warning' | 'error'}>{alert?.msg}</Alert>
				</Collapse>
			</Main>
		</HomeTheme>
	);
};

export default NewUser;
