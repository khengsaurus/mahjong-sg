import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { Scrollable } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const Help = () => {
	const { helpContent } = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const [showContent, setShowContent] = useState(-1);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<Scrollable className="scrollable">
			<div className="content">
				{sections.map((section, ix1) => (
					<Accordion key={ix1} expanded={ix1 === showContent} onChange={() => toggleShow(ix1)}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<StyledText text={section.title.replaceAll('{platform}', platform)} variant="body1" />
						</AccordionSummary>
						<AccordionDetails style={{ maxHeight: '50vh', overflow: 'scroll' }}>
							<ul>
								{section.points.map((point, ix2) => (
									<li key={`section-${ix1}-${ix2}`}>
										{parse(point.replaceAll('{platform}', platform))}
									</li>
								))}
							</ul>
						</AccordionDetails>
					</Accordion>
				))}
			</div>
		</Scrollable>
	);

	return <HomePage markup={markup} title={HomeScreenText.HELP} misc={2} skipVerification />;
};

export default Help;
