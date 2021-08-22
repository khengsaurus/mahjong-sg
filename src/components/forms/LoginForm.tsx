import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import { authLogin_EmailPass, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import { FormField } from './FormField';

/* Successful login: 3 reads, unsuccessful login: 1 read */
const LoginForm: React.FC = () => {
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });
	const { login, setUserEmail } = useContext(AppContext);

	// Solution for error "Can't perform a React state update on an unmounted component. This is a no-op..."
	useEffect(() => {
		let isMounted = true;
		return () => {
			isMounted = false;
		};
	}, []);

	function handleSubmit(values: EmailPass, successCallback: () => void) {
		authLogin_EmailPass(values)
			.then(email => {
				if (email === values.email) {
					setUserEmail(email);
					resolveUser_Email(email)
						.then(user => {
							if (user) {
								login(user);
								successCallback();
								setAlert({ status: 'info', msg: '' });
								history.push('/');
							} else {
								// User not registered, redirect to NewUser
								history.push('/NewUser');
							}
						})
						.catch(err => {
							console.log(err);
						});
				} else {
					// Auth login failed
				}
			})
			.catch(err => {
				setAlert({ status: 'error', msg: err.toString() });
			});
	}

	const markup: JSX.Element = (
		<div>
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={async (values, { resetForm }) => {
					handleSubmit(values, resetForm);
				}}
			>
				{({ values }) => (
					<Form>
						<Field name="email" label="Email" type="text" component={FormField} />
						<br></br>
						<br></br>
						<Field name="password" label="Password" type="password" component={FormField} />
						<br></br>
						<br></br>
						<Button
							autoFocus
							variant="outlined"
							disabled={values.email.trim() === '' || values.password.trim() === ''}
							type="submit"
						>
							Login
						</Button>
						<br></br>
						<br></br>
					</Form>
				)}
			</Formik>
			{alert.msg !== '' ? (
				<>
					<Alert severity={alert.status}>{alert.msg}</Alert>
					<br></br>
				</>
			) : null}
		</div>
	);

	// const markup: JSX.Element = (
	// 	<div>
	// 		<Formik
	// 			initialValues={{ username: '', password: '' }}
	// 			onSubmit={async (values, { resetForm }) => {
	// 				attemptLoginUserPass(values)
	// 					.catch(err => {
	// 						setAlert({ status: 'error', msg: err.toString() });
	// 					})
	// 					.then(user => {
	// 						if (user) {
	// 							login(user);
	// 							resetForm();
	// 							setAlert({ status: 'info', msg: '' });
	// 						}
	// 					});
	// 			}}
	// 		>
	// 			{({ values }) => (
	// 				<Form>
	// 					<Field name="username" label="Username" type="text" component={FormField} />
	// 					<br></br>
	// 					<br></br>
	// 					<Field name="password" label="Password" type="password" component={FormField} />
	// 					<br></br>
	// 					<br></br>
	// 					<Button
	// 						autoFocus
	// 						variant="outlined"
	// 						disabled={values.username.trim() === '' || values.password.trim() === ''}
	// 						type="submit"
	// 					>
	// 						Login
	// 					</Button>
	// 					<br></br>
	// 					<br></br>
	// 					{alert.msg !== '' ? (
	// 						<>
	// 							<Alert severity={alert.status}>{alert.msg}</Alert>
	// 							<br></br>
	// 						</>
	// 					) : null}
	// 				</Form>
	// 			)}
	// 		</Formik>
	// 	</div>
	// );

	return markup;
};

export default LoginForm;
