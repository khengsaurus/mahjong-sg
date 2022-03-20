import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { CustomFade, SampleTile } from 'components';
import { Animals } from 'handEnums';
import parse from 'html-react-parser';
import React from 'react';
import { StyledText } from 'style/StyledMui';
import '../../../App.scss';

const SampleTiles = ({ tiles, parentKey }) => {
	const cards = tiles.split(',');
	return (
		<div className="small-tiles">
			{cards.map((card, index) => {
				const isAnimal = Animals.includes(card);
				return (
					<SampleTile
						key={`${parentKey}-${index}`}
						card={card}
						border={isAnimal}
						gold={false}
					/>
				);
			})}
		</div>
	);
};

function renderAccordionDetails(
	points: string[],
	index: string | number,
	platform: string
) {
	return (
		<div className="content-wrapper">
			<ul>
				{points.map((point, index2) => {
					const key = `section-${index}-${index2}`;
					if (point.startsWith('_render_')) {
						const arr = point.slice(8).split('_');
						return (
							<div key={key} className="list-content">
								{arr.length === 2 ? (
									<>
										{parse(arr[0].replace(/{platform}/g, platform))}
										<SampleTiles tiles={arr[1]} parentKey={key} />
									</>
								) : (
									<SampleTiles tiles={arr[0]} parentKey={key} />
								)}
							</div>
						);
					} else {
						return (
							<li key={key}>
								{parse(point.replace(/{platform}/g, platform))}
							</li>
						);
					}
				})}
			</ul>
		</div>
	);
}

interface IHelpContent {
	sections: IHelpItem[];
	showContent: number;
	toggleShow: (i: number) => void;
	overlayTimeout: number;
	platform: string;
}

const HelpContent: React.FC<IHelpContent> = ({
	sections,
	showContent,
	toggleShow,
	overlayTimeout,
	platform
}: IHelpContent) => {
	return (
		<>
			{sections.map((section, index) => {
				const show = showContent === -1 || index === showContent;
				return (
					<CustomFade key={index} show={show} timeout={overlayTimeout}>
						<Accordion
							expanded={index === showContent}
							onChange={() => toggleShow(index)}
							TransitionProps={{ timeout: overlayTimeout }}
							disableGutters
						>
							<AccordionSummary
								expandIcon={<ChevronRightIcon />}
								style={{ height: 40 }}
							>
								<StyledText
									text={section.title.replace(/{platform}/g, platform)}
									variant="body1"
								/>
							</AccordionSummary>
							<AccordionDetails
								style={{
									maxHeight:
										'calc(100vh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
								}}
							>
								{renderAccordionDetails(
									section.points || [],
									index,
									platform
								)}
							</AccordionDetails>
						</Accordion>
					</CustomFade>
				);
			})}
		</>
	);
};

export default HelpContent;
