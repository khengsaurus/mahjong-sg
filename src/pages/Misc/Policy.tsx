import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import parse from 'html-react-parser';
import { isArray, isEmpty } from 'lodash';
import HomePage from 'pages/Home/HomePage';
import { StyledText } from 'style/StyledMui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import { isMobile } from 'utility';
import initContent from './initContent.json';

const Policy = () => {
	const { policyContent } = useSelector((store: IStore) => store);
	const content = !isEmpty(policyContent) && isArray(policyContent) ? policyContent : initContent.policyContent;
	const [showContent, setShowContent] = useState(-1);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<div className="content">
			{(content || []).map((c, index) => {
				return (
					<Accordion key={index} expanded={index === showContent} onChange={() => toggleShow(index)}>
						<AccordionSummary expandIcon={<ChevronRightIcon />} style={{ height: '40px' }}>
							<StyledText text={c.title.replaceAll('{platform}', platform)} variant="body1" />
						</AccordionSummary>
						<AccordionDetails>
							<p>{parse(c.content.replaceAll('{platform}', platform))}</p>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);

	return <HomePage markup={markup} title={HomeScreenText.POLICY} misc={2} skipVerification />;
};

export default Policy;
