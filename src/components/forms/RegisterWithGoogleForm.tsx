import { Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { User } from '../../Models/User';
import { attemptLoginByEmail, attemptRegisterByEmail } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import { FormField } from './FormField';

interface FormProps {
	onCancel: () => void;
}

const RegisterWithGoogleForm = (props: FormProps) => {
	const { userEmail, login, logout } = useContext(AppContext);
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });

	function cancel() {
		logout();
		props.onCancel();
	}

	const markup = (
		<Formik
			initialValues={{ username: '', email: userEmail }}
			onSubmit={async (values, { resetForm }) => {
				attemptRegisterByEmail(values)
					.then(res => {
						if (res) {
							resetForm();
							setAlert({ status: 'success', msg: 'Registered successfully' });
							try {
								attemptLoginByEmail(userEmail).then((user: User) => {
									setTimeout(function () {
										login(user);
									}, 1000);
								});
							} catch (err) {
								console.log(err);
							}
						}
					})
					.catch(err => {
						setAlert({ status: 'error', msg: err.toString() });
					});
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
							Register
						</Button>
						<br></br>
						<br></br>
						<Button variant={'outlined'} onClick={cancel}>
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
	);

	return markup;
};

export default RegisterWithGoogleForm;
