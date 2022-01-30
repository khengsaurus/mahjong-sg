import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import HomePage from 'platform/pages/Home/HomePage';
import { BottomSpec, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';

const DataPolicy = () => {
	const { user } = useSelector((store: IStore) => store);

	const markup = () => (
		<>
			<Scrollable>
				<div className="content centered">
					<p>
						Mahjong SG does not collect any of your personal data, aside from your email. Your email is used
						solely for account and game management. We will not distribute your email, and you can remove it
						from our records any time by deleting your account.
					</p>
					<br />
					<p>
						Mahjong SG currently does not support username change or password reset. An email address can
						only be used to register one account.
					</p>
					<br />
				</div>
			</Scrollable>
			<BottomSpec>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} style={{ fontSize: 12, padding: 0 }} />
			</BottomSpec>
		</>
	);

	return <HomePage markup={markup} title={HomeScreenText.DATA} skipVerification />;
};

export default DataPolicy;
