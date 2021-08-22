import { Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { history } from '../../App';
import '../../App.scss';
import { FormField } from '../../components/Forms/FormField';
import { User } from '../../Models/User';
import { newUser_EmailUser, deleteCurrentFBUser, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';

const NewUser = () => {
	const { userEmail, login, logout } = useContext(AppContext);
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });

	function handleCancel() {
		deleteCurrentFBUser();
		logout();
		history.push('/Login');
	}

	function pushToHome() {
		history.push('/Home');
	}

	function handleSubmit(values: EmailUser, successCallback: () => void) {
		newUser_EmailUser(values)
			.then(res => {
				if (res) {
					successCallback();
					setAlert({ status: 'success', msg: 'Registered successfully' });
					resolveUser_Email(userEmail)
						.then((user: User) => {
							login(user);
							setTimeout(function () {
								pushToHome();
							}, 1000);
						})
						.catch(err => {
							if (err.message === 'Username already taken') {
								setAlert({ status: 'error', msg: err.message });
							}
						});
				}
			})
			.catch(err => {
				setAlert({ status: 'error', msg: err.toString() });
			});
	}

	const markup = (
		<div className="main">
			<Formik
				initialValues={{ username: '', email: userEmail }}
				onSubmit={async (values, { resetForm }) => {
					handleSubmit(values, resetForm);
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
