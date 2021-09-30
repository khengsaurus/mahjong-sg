import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { history } from '../../App';
import { Pages, Status } from '../../global/enums';
import { authLogin_EmailPass, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';
import FormField from './FormField';

const LoginForm: React.FC = () => {
	const [alert, setAlert] = useState<IAlert>({ status: Status.INFO, msg: '' });
	const { login, setUserEmail } = useContext(AppContext);

	function handleSubmit(values: IEmailPass) {
		authLogin_EmailPass(values)
			.then(email => {
				if (email === values.email) {
					setUserEmail(email);
					resolveUser_Email(email)
						.then(user => {
							if (user) {
								login(user, false);
								history.push(Pages.INDEX);
							} else {
								// User not registered, redirect to NewUser
								history.push(Pages.NEWUSER);
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
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	const markup: JSX.Element = (
		<div>
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={async values => {
					handleSubmit(values);
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
							variant="text"
							disabled={values.email.trim() === '' || values.password.trim() === ''}
							type="submit"
						>
							{`Login`}
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
