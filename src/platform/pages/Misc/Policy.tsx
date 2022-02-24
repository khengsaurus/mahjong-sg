import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { getHighlightColor } from 'platform/style/MuiStyles';
import { StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';

const Policy = () => {
	const {
		policyContent,
		theme: { backgroundColor, mainTextColor }
	} = useSelector((store: IStore) => store);
	const content = policyContent || initContent.policyContent;
	const [showContent, setShowContent] = useState(-1);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<div className="content">
			{(content || []).map((c, index) => {
				const activeColor = showContent === index ? getHighlightColor(backgroundColor) : mainTextColor;
				return (
					<Accordion key={index} expanded={index === showContent} onChange={() => toggleShow(index)}>
						<AccordionSummary expandIcon={<ChevronRightIcon />} style={{ height: '40px' }}>
							<StyledText
								text={c.title.replaceAll('{platform}', platform)}
								color={activeColor}
								variant="body1"
							/>
						</AccordionSummary>
						<AccordionDetails style={{ borderColor: activeColor }}>
							<p className="para">{parse(c.content.replaceAll('{platform}', platform))}</p>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);

	return <HomePage markup={markup} title={HomeScreenText.POLICY} misc={2} skipVerification />;
};

export default Policy;
