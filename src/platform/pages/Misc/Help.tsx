import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { Scrollable } from 'platform/style/StyledComponents';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const Help = () => {
	const { helpContent } = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const platform = isMobile() ? 'app' : 'website';

	const markup = () => (
		<Scrollable className="scrollable">
			<div className="content">
				{sections.map((section, ix1) => (
					<Fragment key={`section=${ix1}`}>
						<h4>{parse(section.title.replaceAll('{platform}', platform))}</h4>
						<ul>
							{section.points.map((point, ix2) => (
								<li key={`section-${ix1}-${ix2}`}>{parse(point.replaceAll('{platform}', platform))}</li>
							))}
						</ul>
						{section?.ps && <p className="ps">{parse(section.ps.replaceAll('{platform}', platform))}</p>}
					</Fragment>
				))}
				<h4>Thank you for reading, and have fun!</h4>
			</div>
		</Scrollable>
	);

	return <HomePage markup={markup} misc={2} skipVerification />;
};

export default Help;
