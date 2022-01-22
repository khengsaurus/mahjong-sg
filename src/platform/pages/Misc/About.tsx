import parse from 'html-react-parser';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { capacitorLogo, firebaseLogo, reactLogo } from 'shared/images/symbols';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const About = () => {
	const { user, aboutContent } = useSelector((store: IStore) => store);
	const { descMobile = '', descWeb = '', reachOut = '' } = aboutContent || initContent.aboutContent;
	const platform = isMobile() ? 'app' : 'website';

	const renderLocalContent = () => (
		<div className="content centered">
			<h3>About</h3>
			<p>
				<span>
					Thank you for using this {platform}. There is still much work in progress, but we hope you like it
					so far.{' '}
				</span>
				{isMobile() ? parse(descMobile) : parse(descWeb)}
			</p>
			<br />
			<p>{parse(reachOut)}</p>
			<br />
			<div className="stack">
				<p>Created with </p>
				<div className="logos">
					<img alt="react-logo" src={reactLogo} />
					<img alt="firebase-logo" src={firebaseLogo} />
					{isMobile() && <img alt="ionic-logo" src={capacitorLogo} />}
				</div>
			</div>
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				<Scrollable className="scrollable centered">{renderLocalContent()}</Scrollable>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} />
			</Main>
		</HomeTheme>
	);
};

export default About;
