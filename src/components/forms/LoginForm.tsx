import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { history } from '../../App';
import { authLogin_EmailPass, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import FormField from './FormField';

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

	function handleSubmit(values: EmailPass, formCallback: () => void) {
		authLogin_EmailPass(values)
			.then(email => {
				if (email === values.email) {
					setUserEmail(email);
					resolveUser_Email(email)
						.then(user => {
							if (user) {
								login(user);
								formCallback();
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
	return markup;
};

export default LoginForm;
