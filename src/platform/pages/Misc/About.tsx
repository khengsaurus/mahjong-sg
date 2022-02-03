import parse from 'html-react-parser';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import HomePage from 'platform/pages/Home/HomePage';
import { BottomSpec, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { capacitorLogo, firebaseLogo, reactLogo } from 'shared/images/symbols';
import { ButtonText, HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const About = () => {
	const { user, aboutContent } = useSelector((store: IStore) => store);
	const { descMobile = '', descWeb = '', reachOut = '' } = aboutContent || initContent.aboutContent;
	const platform = isMobile() ? 'app' : 'website';

	const markup = () => (
		<>
			<Scrollable>
				<div className="content centered">
					<p>
						<span>
							Thank you for using this {platform}. There is still much work in progress, but we hope you
							like it so far.{' '}
						</span>
						{isMobile()
							? parse(descMobile.replace('{platform}', platform))
							: parse(descWeb.replace('{platform}', platform))}
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
			</Scrollable>
			<BottomSpec>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} style={{ fontSize: 12, padding: 0 }} />
			</BottomSpec>
		</>
	);

	return <HomePage markup={markup} title={HomeScreenText.ABOUT} skipVerification />;
};

export default About;
