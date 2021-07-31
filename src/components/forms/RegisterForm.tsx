import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { attemptRegister } from '../../util/fbUserFns';
import { FormField } from './FormField';

const RegisterForm: React.FC = () => {
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });

	const markup = (
		<Formik
			initialValues={{ username: '', password: '' }}
			onSubmit={async (values, { resetForm }) => {
				attemptRegister(values)
					.catch(err => {
						setAlert({ status: 'error', msg: err.toString() });
					})
					.then(res => {
						if (res) {
							resetForm();
							setAlert({ status: 'success', msg: 'Registered successfully' });
						}
					});
			}}
		>
			{({ values }) => (
				<Form>
					<Field name="username" label="Username" component={FormField} />
					<br></br>
					<br></br>
					<Field name="password" label="Password" type="password" component={FormField} />
					<br></br>
					<br></br>
					<Button
						autoFocus
						variant="outlined"
						disabled={values.username.trim() === '' || values.password.trim() === ''}
						type="submit"
					>
						Register
					</Button>
					<br></br>
					<br></br>
					{alert.msg !== '' ? (
						<>
							<Alert severity={alert.status}>{alert.msg}</Alert> <br></br>
						</>
					) : null}
				</Form>
			)}
		</Formik>
	);

	return markup;
};

export default RegisterForm;
