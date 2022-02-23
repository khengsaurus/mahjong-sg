import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { Scrollable } from 'platform/style/StyledComponents';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';

const Policy = () => {
	const { policyContent } = useSelector((store: IStore) => store);
	const content = policyContent || initContent.policyContent;
	const [showContent, setShowContent] = useState(-1);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<Scrollable>
			<div className="content">
				{(content || []).map((c, index) => {
					return (
						<Accordion key={index} expanded={index === showContent} onChange={() => toggleShow(index)}>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>{c.title}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<p className="para">{parse(c.content.replaceAll('{platform}', platform))}</p>
							</AccordionDetails>
						</Accordion>
					);
				})}
			</div>
		</Scrollable>
	);

	return <HomePage markup={markup} title={HomeScreenText.POLICY} misc={2} skipVerification />;
};

export default Policy;
