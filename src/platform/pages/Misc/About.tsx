import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName, Platform } from 'shared/enums';
import { firebaseLogo, capacitorLogo, reactLogo } from 'shared/images/symbols';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './misc.scss';

const About = () => {
	const { user } = useSelector((store: IStore) => store);
	const platform = process.env.REACT_APP_PLATFORM === Platform.MOBILE ? 'app' : 'website';

	const renderLocalContent = () => (
		<div className="content centered">
			<h3>About</h3>
			<p>
				Thank you for using this {platform}. There is still much work in progress, but we hope you like it so
				far.
			</p>
			<br />
			<p>
				If you have any feedback or would like to get in touch, do reach out to us at mahjongsgapp@gmail.com, or
				on{' '}
				<a
					href="https://www.linkedin.com/in/tzi-kheng-sim-4a561616b/"
					style={{ color: '#005eff', textDecoration: 'none' }}
				>
					LinkedIn.
				</a>
			</p>
			{
				process.env.REACT_APP_PLATFORM === Platform.MOBILE ? (
					<>
						<br />
						<p>
							Find us online at{' '}
							<a href="https://www.mahjong-sg.com/" style={{ color: '#005eff' }}>
								www.mahjong-sg.com
							</a>
						</p>
					</>
				) : null
				// <p>Find Mahjong SG in the app store today.</p>
				// https://www.linkedin.com/in/tzi-kheng-sim-4a561616b/
			}
			<br />
			<div className="stack">
				<p>Created with </p>
				<div className="logos">
					<img alt="react-logo" src={reactLogo} />
					<img alt="firebase-logo" src={firebaseLogo} />
					{process.env.REACT_APP_PLATFORM === Platform.MOBILE && <img alt="ionic-logo" src={capacitorLogo} />}
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
