import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { history } from '../../App';
import '../../App.scss';
import FormField from '../../components/FormComponents/FormField';
import { Pages, Status } from '../../global/enums';
import { Main } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import { User } from '../../Models/User';
import { deleteCurrentFBUser, newUser_IEmailUser, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';

const NewUser = () => {
	const { userEmail, login, logout } = useContext(AppContext);
	const [alert, setAlert] = useState<IAlert>({ status: Status.INFO, msg: '' });

	function handleCancel() {
		deleteCurrentFBUser();
		logout();
		history.push(Pages.LOGIN);
	}

	function handleSubmit(values: IEmailUser, callback: () => void) {
		newUser_IEmailUser(values)
			.then(res => {
				if (res) {
					setAlert({ status: Status.SUCCESS, msg: 'Username set' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	function successCallback() {
		resolveUser_Email(userEmail)
			.then((user: User) => {
				login(user, false);
				setTimeout(function () {
					history.push(Pages.HOME);
				}, 1500);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: Status.ERROR, msg: err.message });
				}
			});
	}

	const markup = (
		<Main>
			<Formik
				initialValues={{ username: '', email: userEmail }}
				onSubmit={async values => {
					handleSubmit(values, successCallback);
				}}
			>
				{({ values }) => (
					<>
						<Title title={`Welcome! Choose a username`} />
						<Form>
							<Field name="username" label="Username" component={FormField} />
							<br></br>
							<br></br>
							<Button variant="text" disabled={values.username.trim() === ''} type="submit">
								Submit
							</Button>
							<br></br>
							{alert.status !== Status.SUCCESS && <StyledButton label="Cancel" onClick={handleCancel} />}
							<br></br>
							{alert.msg !== '' ? (
								<>
									<Alert severity={alert.status}>{alert.msg}</Alert> <br></br>
								</>
							) : null}
						</Form>
					</>
				)}
			</Formik>
		</Main>
	);

	return markup;
};

export default NewUser;
