import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';

const Policy = () => {
	const { policyContent } = useSelector((store: IStore) => store);
	const { data = '', gambling = '' } = policyContent || initContent.policyContent;
	const platform = isMobile() ? 'app' : 'website';

	const markup = () => (
		<Scrollable>
			<div className="content centered">
				<p>{parse(data.replaceAll('{platform}', platform))}</p>
				<br />
				<p>{parse(gambling.replaceAll('{platform}', platform))}</p>
			</div>
		</Scrollable>
	);

	return <HomePage markup={markup} title={HomeScreenText.POLICY} misc={2} skipVerification />;
};

export default Policy;
