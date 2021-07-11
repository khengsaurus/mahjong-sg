import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { attemptLogin } from '../../util/firebaseServiceUtil';
import { AppContext } from '../../util/hooks/AppContext';
import { FormField } from './FormField';

/* Successful login: 3 reads, unsuccessful login: 1 read */
const LoginForm: React.FC = () => {
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });
	const { login } = useContext(AppContext);

	// Solution for error "Can't perform a React state update on an unmounted component. This is a no-op..."
	useEffect(() => {
		let isMounted = true;
		return () => {
			isMounted = false;
		};
	}, []);

	const markup: JSX.Element = (
		<div>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { resetForm }) => {
					attemptLogin(values)
						.catch(err => {
							setAlert({ status: 'error', msg: err.toString() });
						})
						.then(user => {
							if (user) {
								login(user);
								resetForm();
								setAlert({ status: 'info', msg: '' });
							}
						});
				}}
			>
				{({ values }) => (
					<Form>
						<Field name="username" label="Username" type="text" component={FormField} />
						<br></br>
						<br></br>
						<Field name="password" label="Password" type="password" component={FormField} />
						<br></br>
						<br></br>
						<Button
							variant="outlined"
							disabled={values.username.trim() === '' || values.password.trim() === ''}
							type="submit"
						>
							Login
						</Button>
						<br></br>
						<br></br>
						{alert.msg !== '' ? <Alert severity={alert.status}>{alert.msg}</Alert> : null}
					</Form>
				)}
			</Formik>
		</div>
	);

	return markup;
};

export default LoginForm;
