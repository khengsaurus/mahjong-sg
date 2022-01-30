import parse from 'html-react-parser';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import HomePage from 'platform/pages/Home/HomePage';
import { BottomSpec, Scrollable } from 'platform/style/StyledComponents';
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

	const markup = () => (
		<>
			<Scrollable className="scrollable">
				<div className="content">
					{sections.map((section, ix1) => (
						<Fragment key={`section=${ix1}`}>
							<h4>{parse(section.title.replace('{platform}', platform))}</h4>
							<ul>
								{section.points.map((point, ix2) => (
									<li key={`section-${ix1}-${ix2}`}>
										{parse(point.replace('{platform}', platform))}
									</li>
								))}
							</ul>
							{section?.ps && <p className="ps">{parse(section.ps.replace('{platform}', platform))}</p>}
						</Fragment>
					))}
					<h4>Thank you for reading, and have fun!</h4>
				</div>
			</Scrollable>
			<BottomSpec>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} style={{ fontSize: 12, padding: 0 }} />
			</BottomSpec>
		</>
	);

	return <HomePage markup={markup} skipVerification />;
};

export default Help;
