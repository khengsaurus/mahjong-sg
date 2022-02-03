import parse from 'html-react-parser';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import HomePage from 'platform/pages/Home/HomePage';
import { BottomSpec, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';

const Policy = () => {
	const { user, policyContent } = useSelector((store: IStore) => store);
	const { data = '', gambling = '' } = policyContent || initContent.policyContent;
	const platform = isMobile() ? 'app' : 'website';

	const markup = () => (
		<>
			<Scrollable>
				<div className="content centered">
					<p>{parse(data.replace('{platform}', platform))}</p>
					<br />
					<p>{parse(gambling.replace('{platform}', platform))}</p>
				</div>
			</Scrollable>
			<BottomSpec>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} style={{ fontSize: 12, padding: 0 }} />
			</BottomSpec>
		</>
	);

	return <HomePage markup={markup} title={HomeScreenText.POLICY} skipVerification />;
};

export default Policy;
