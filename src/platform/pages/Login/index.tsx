import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import { Field, Form, Formik } from 'formik';
import FormField from 'platform/components/FormComponents/FormField';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Centered, Main } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useContext, useState } from 'react';
import { Pages, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks/AppContext';
import { authLogin_EmailPass, authRegister_EmailPass, resolveUser_Email } from 'shared/service/fbUserFns';
import './login.scss';

const Login = () => {
	const [showRegister, setShowRegister] = useState(false);
	const { login, setUserEmail, alert, setAlert } = useContext(AppContext);

	function handleLogin(values: IEmailPass) {
		authLogin_EmailPass(values)
			.then(email => {
				if (email === values.email) {
					setUserEmail(email);
					resolveUser_Email(email)
						.then(user => {
							setAlert(null);
							if (user) {
								login(user, false);
								history.push(Pages.INDEX);
							} else {
								// User not registered, redirect to NewUser
								history.push(Pages.NEWUSER);
							}
						})
						.catch(err => {
							console.error(err);
						});
				} else {
					// Auth login failed
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	function handleRegister(values: IEmailPass, formCallback: () => void) {
		authRegister_EmailPass(values)
			.then(res => {
				if (res) {
					formCallback();
					handleLogin(values);
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	const loginMarkup: JSX.Element = (
		<div>
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={async values => {
					handleLogin(values);
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
						<StyledButton
							label={`Login`}
							autoFocus
							type="submit"
							disabled={values.email.trim() === '' || values.password.trim() === ''}
						/>
					</Form>
				)}
			</Formik>
		</div>
	);

	const registerMarkup = (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={async (values, { resetForm }) => {
				handleRegister(values, resetForm);
			}}
		>
			{({ values }) => (
				<Form>
					<Field name="email" label="Email" component={FormField} />
					<br></br>
					<br></br>
					<Field name="password" label="Password" type="password" component={FormField} />
					<br></br>
					<br></br>
					<StyledButton
						label={`Register`}
						autoFocus
						type="submit"
						disabled={values.email.trim() === '' || values.password.trim() === ''}
					/>
				</Form>
			)}
		</Formik>
	);

	return (
		<HomeTheme>
			<Main>
				<Centered>
					{showRegister ? registerMarkup : loginMarkup}
					<StyledButton
						label={showRegister ? `Back to login` : `Register now`}
						onClick={() => {
							setAlert(null);
							setShowRegister(!showRegister);
						}}
					/>
					{alert && (
						<>
							<br></br>
							<Alert severity={alert.status as 'success' | 'info' | 'warning' | 'error'}>
								{alert.msg}
							</Alert>
						</>
					)}
				</Centered>
			</Main>
		</HomeTheme>
	);
};

export default Login;
