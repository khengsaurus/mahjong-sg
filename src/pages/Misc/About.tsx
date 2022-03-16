import parse from 'html-react-parser';
import HomePage from 'pages/Home/HomePage';
import { useSelector } from 'react-redux';
import { capacitorLogo, firebaseLogo, reactLogo } from 'images/symbols';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import { isMobile } from 'utility';
import initContent from './initContent.json';
import './misc.scss';

const About = () => {
	const {
		aboutContent,
		theme: { mainTextColor }
	} = useSelector((store: IStore) => store);
	const { descMobile = '', descWeb = '', reachOut = '' } = aboutContent || initContent.aboutContent;
	const platform = isMobile() ? 'app' : 'website';

	const markup = () => (
		<div className="content centered" style={{ color: mainTextColor }}>
			<p>
				<span>
					Thank you for using this {platform}. There is still much work in progress, but we hope you like it
					so far.{' '}
				</span>
				{isMobile()
					? parse(descMobile.replaceAll('{platform}', platform))
					: parse(descWeb.replaceAll('{platform}', platform))}
			</p>
			<p>{parse(reachOut)}</p>
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

	return <HomePage markup={markup} title={HomeScreenText.ABOUT} misc={2} skipVerification />;
};

export default About;
