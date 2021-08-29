import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { authRegister_EmailPass } from '../../util/fbUserFns';
import FormField from './FormField';

/**
 * Email and password -> create a new set of firebase auth credentials
 */
const RegisterForm: React.FC = () => {
	const [alert, setAlert] = useState<alert>({ status: 'info', msg: '' });

	function handleSubmit(values: EmailPass, formCallback: () => void) {
		authRegister_EmailPass(values)
			.then(res => {
				if (res) {
					setAlert({ status: 'success', msg: 'Registered successfully' });
					formCallback();
				}
			})
			.catch(err => {
				setAlert({ status: 'error', msg: err.toString() });
			});
	}

	const markup = (
		<Formik
			initialValues={{ email: '', password: '' }}
			onSubmit={async (values, { resetForm }) => {
				handleSubmit(values, resetForm);
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
					<Button
						autoFocus
						variant="outlined"
						disabled={values.email.trim() === '' || values.password.trim() === ''}
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
