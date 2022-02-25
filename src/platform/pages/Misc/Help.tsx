import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary, Fade } from '@mui/material';
import parse from 'html-react-parser';
import HomePage, { renderDefaultTitle } from 'platform/pages/Home/HomePage';
import { StyledText } from 'platform/style/StyledMui';
import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Transition } from 'shared/enums';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const Help = () => {
	const { helpContent } = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const [showContent, setShowContent] = useState(-1);
	const hasToggledRef = useRef(false);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		hasToggledRef.current = true;
		setShowContent(index === showContent ? -1 : index);
	}

	const overlayTimeout = useMemo(() => {
		return !hasToggledRef.current ? Transition.INSTANT : Transition.MEDIUM;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasToggledRef.current]);

	const transitionAmt = useMemo(() => {
		return showContent === -1 ? '0px' : `calc(${((sections.length - 2 - 2 * showContent) / 2) * 40}px)`; // botEle - topEle
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sections.length, showContent]);

	const markup = () => (
		<div
			className="content"
			style={{
				transition: `${overlayTimeout}ms`,
				transform: `translateY(${transitionAmt})`
			}}
		>
			<Fade in={showContent === -1} timeout={overlayTimeout}>
				<div>{renderDefaultTitle(HomeScreenText.HELP)}</div>
			</Fade>
			{sections.map((section, index1) => {
				const show = showContent === -1 || index1 === showContent;
				return (
					<Fade key={index1} in={show} timeout={overlayTimeout}>
						<div>
							<Accordion expanded={index1 === showContent} onChange={() => toggleShow(index1)}>
								<AccordionSummary expandIcon={<ChevronRightIcon />} style={{ height: 40 }}>
									<StyledText
										text={section.title.replaceAll('{platform}', platform)}
										variant="body1"
									/>
								</AccordionSummary>
								<AccordionDetails
									style={{
										maxHeight:
											'calc(100vh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
										overflow: 'scroll'
									}}
								>
									<div className="content-wrapper">
										<ul>
											{section.points.map((point, index2) => (
												<li key={`section-${index1}-${index2}`}>
													{parse(point.replaceAll('{platform}', platform))}
												</li>
											))}
										</ul>
									</div>
								</AccordionDetails>
							</Accordion>
						</div>
					</Fade>
				);
			})}
		</div>
	);

	return (
		<HomePage
			markup={markup}
			misc={2}
			customBack={
				showContent !== -1
					? () => {
							setShowContent(-1);
					  }
					: null
			}
			skipVerification
		/>
	);
};

export default Help;
