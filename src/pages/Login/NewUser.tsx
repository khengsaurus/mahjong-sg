import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { history } from '../../App';
import '../../App.scss';
import { FormField } from '../../components/Forms/FormField';
import { User } from '../../Models/User';
import { deleteCurrentFBUser, newUser_EmailUser, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';

const NewUser = () => {
	const { userEmail, login, logout } = useContext(AppContext);
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });

	function handleCancel() {
		deleteCurrentFBUser();
		logout();
		history.push('/Login');
	}

	function handleSubmit(values: EmailUser, callback: () => void) {
		newUser_EmailUser(values)
			.then(res => {
				if (res) {
					setAlert({ status: 'success', msg: 'Username available' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: 'error', msg: err.toString() });
			});
	}

	function successCallback() {
		resolveUser_Email(userEmail)
			.then((user: User) => {
				login(user);
				setTimeout(function () {
					history.push('/Home');
				}, 1500);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: 'error', msg: err.message });
				}
			});
	}

	const markup = (
		<div className="main">
			<Formik
				initialValues={{ username: '', email: userEmail }}
				onSubmit={async values => {
					handleSubmit(values, successCallback);
				}}
			>
				{({ values }) => (
					<>
						<Typography variant="h6">{`Welcome! Choose a username`}</Typography>
						<Form>
							<Field name="username" label="Username" component={FormField} />
							<br></br>
							<br></br>
							<Button variant="outlined" disabled={values.username.trim() === ''} type="submit">
								Submit
							</Button>
							<br></br>
							<br></br>
							<Button variant={'outlined'} onClick={handleCancel}>
								Cancel
							</Button>
							<br></br>
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
		</div>
	);

	return markup;
};

export default NewUser;
