import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';

const DataPolicy = () => {
	const { user } = useSelector((store: IStore) => store);

	const renderLocalContent = () => (
		<div className="content">
			<h3>Data Policy</h3>
			<p>
				We do not collect any of your personal data, aside from your email. Your email is used solely for
				account and game management. We will not distribute your email, and you can remove it from our records
				any time by deleting your account.
			</p>
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				<Scrollable>{renderLocalContent()}</Scrollable>
				<br />
				<br />
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} />
			</Main>
		</HomeTheme>
	);
};

export default DataPolicy;
