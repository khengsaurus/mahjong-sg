import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import parse from 'html-react-parser';
import { isArray, isEmpty } from 'lodash';
import { HomePage } from 'pages';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';
import { StyledText } from 'style/StyledMui';
import initContent from './initContent.json';

const Policy = () => {
	const { policyContent } = useSelector((store: IStore) => store);
	const content =
		!isEmpty(policyContent) && isArray(policyContent?.policies)
			? policyContent.policies
			: initContent.policyContent;
	const [showContent, setShowContent] = useState(-1);

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<div className="content">
			{(content || []).map((c, index) => {
				return (
					<Accordion
						key={index}
						expanded={index === showContent}
						onChange={() => toggleShow(index)}
					>
						<AccordionSummary
							expandIcon={<ChevronRightIcon />}
							style={{ height: '40px' }}
						>
							<StyledText
								text={c.title.replace(/{platform}/g, 'website')}
								variant="body1"
							/>
						</AccordionSummary>
						<AccordionDetails style={{ paddingTop: 0 }}>
							<p className="no-margin">
								{parse(c.content.replace(/{platform}/g, 'website'))}
							</p>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);

	return (
		<HomePage
			markup={markup}
			title={HomeScreenText.POLICY}
			misc={2}
			skipVerification
		/>
	);
};

export default Policy;
