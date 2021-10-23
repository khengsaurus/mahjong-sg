import { history } from 'App';
import 'App.scss';
import { Field, Form, Formik } from 'formik';
import FormField from 'platform/components/FormComponents/FormField';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useContext } from 'react';
import { Pages, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks/AppContext';
import { User } from 'shared/models';
import { deleteCurrentFBUser, newUser_IEmailUser, resolveUser_Email } from 'shared/service/fbUserFns';

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
					setAlert({ status: Status.SUCCESS, msg: 'Registered successfully' });
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
					setAlert(null);
				}, 1000);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: Status.ERROR, msg: err.message });
				}
			});
	}

	const markup = (
		<HomeTheme>
			<Main>
				<Formik
					initialValues={{ uN: '', email: userEmail }}
					onSubmit={async values => {
						handleSubmit(values, successCallback);
					}}
				>
					{({ values }) => (
						<>
							<Title title={`Welcome! Choose a username`} />
							<Form>
								<Field name="uN" label="Username" component={FormField} />
								<br></br>
								<br></br>
								<StyledButton
									label={`Submit`}
									autoFocus
									type="submit"
									disabled={values.uN.trim() === ''}
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
		</HomeTheme>
	);

	return markup;
};

export default NewUser;
