import parse from 'html-react-parser';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const Help = () => {
	const { user, helpContent } = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const platform = isMobile() ? 'app' : 'website';

	const renderLocalContent = () => (
		<div className="content">
			{sections.map((section, ix1) => (
				<Fragment key={`section=${ix1}`}>
					<h4>{parse(section.title.replace('{platform}', platform))}</h4>
					<ul>
						{section.points.map((point, ix2) => (
							<li key={`section-${ix1}-${ix2}`}>{parse(point.replace('{platform}', platform))}</li>
						))}
					</ul>
					{section?.ps && <p className="ps">{parse(section.ps.replace('{platform}', platform))}</p>}
				</Fragment>
			))}
			<br />
			<h4>Thank you for reading, and have fun!</h4>
			<br />
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				<Scrollable className="scrollable">{renderLocalContent()}</Scrollable>
				<div className="home-button">
					<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} />
				</div>
			</Main>
		</HomeTheme>
	);
};

export default Help;
