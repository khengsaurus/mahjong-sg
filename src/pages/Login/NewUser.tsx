import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { history } from '../../App';
import '../../App.scss';
import FormField from '../../components/FormComponents/FormField';
import { Pages, Status } from '../../global/enums';
import { Main } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import { User } from '../../Models/User';
import { deleteCurrentFBUser, newUser_IEmailUser, resolveUser_Email } from '../../util/fbUserFns';
import { AppContext } from '../../util/hooks/AppContext';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);

	function handleCancel() {
		deleteCurrentFBUser();
		logout();
		history.push(Pages.LOGIN);
	}

	function handleSubmit(values: IEmailUser, callback: () => void) {
		newUser_IEmailUser(values)
			.then(res => {
				if (res) {
					setAlert({ status: Status.SUCCESS, msg: 'Username set' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	function successCallback() {
		resolveUser_Email(userEmail)
			.then((user: User) => {
				login(user, false);
				setTimeout(function () {
					history.push(Pages.HOME);
				}, 1500);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: Status.ERROR, msg: err.message });
				}
			});
	}

	const markup = (
		<Main>
			<Formik
				initialValues={{ username: '', email: userEmail }}
				onSubmit={async values => {
					handleSubmit(values, successCallback);
				}}
			>
				{({ values }) => (
					<>
						<Title title={`Welcome! Choose a username`} />
						<Form>
							<Field name="username" label="Username" component={FormField} />
							<br></br>
							<br></br>
							<StyledButton
								label={`Submit`}
								autoFocus
								type="submit"
								disabled={values.username.trim() === ''}
							/>
							{alert?.status !== Status.SUCCESS && (
								<>
									<br></br>
									<StyledButton label="Cancel" onClick={handleCancel} />
								</>
							)}
						</Form>
					</>
				)}
			</Formik>
		</Main>
	);

	return markup;
};

export default NewUser;
