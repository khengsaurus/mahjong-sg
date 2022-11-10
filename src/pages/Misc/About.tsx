import parse from 'html-react-parser';
import { capacitorLogo, firebaseLogo, reactLogo } from 'images/symbols';
import moment from 'moment';
import { HomePage } from 'pages';
import { isMobile, platform } from 'platform';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import initContent from './initContent.json';
import './misc.scss';

const About = () => {
	const [updatedVi, setUpdatedVis] = useState(false);
	const [liVis, setLiVis] = useState(false);
	const {
		aboutContent,
		contentUpdated,
		theme: { mainTextColor }
	} = useSelector((store: IStore) => store);
	const {
		descMobile = '',
		descWeb = '',
		reachOut = '',
		linkedin = ''
	} = aboutContent || initContent.aboutContent;
	const updatedT = useRef<NodeJS.Timeout>(null);
	const liT = useRef<NodeJS.Timeout>(null);

	const markup = () => (
		<div className="content centered" style={{ color: mainTextColor }}>
			<p>
				<span>Thank you for using this {platform}. </span>
				{isMobile
					? parse(descMobile.replace(/{platform}/g, platform))
					: parse(descWeb.replace(/{platform}/g, platform))}
			</p>
			<p>{parse(reachOut)}</p>
			<div className="stack">
				<p>Created with </p>
				<div className="logos">
					<img alt="react-logo" src={reactLogo} />
					<img alt="firebase-logo" src={firebaseLogo} />
					{isMobile && <img alt="ionic-logo" src={capacitorLogo} />}
				</div>
			</div>
			<div
				className={`updated ${updatedVi ? 'visible' : ''}`}
				onClick={() => {
					setUpdatedVis(true);
					if (updatedT.current) clearTimeout(updatedT.current);
					updatedT.current = setTimeout(() => setUpdatedVis(false), 3000);
				}}
			>
				{contentUpdated ? (
					<p>{`Content updated ${moment(contentUpdated).format(
						'DD/MM/YY, h:mm a'
					)}`}</p>
				) : (
					<p>{`Showing cached content`}</p>
				)}
			</div>
			{linkedin && (
				<div
					className={`linkedin ${liVis ? 'visible' : ''}`}
					onClick={() => {
						setLiVis(true);
						if (liT.current) clearTimeout(liT.current);
						liT.current = setTimeout(() => setLiVis(false), 3000);
					}}
				>
					<p>{parse(linkedin)}</p>
				</div>
			)}
		</div>
	);

	return (
		<HomePage
			markup={markup}
			title={HomeScreenText.ABOUT}
			misc={2}
			skipVerification
		/>
	);
};

export default About;
