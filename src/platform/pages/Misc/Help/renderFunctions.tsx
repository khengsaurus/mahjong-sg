import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary, Fade } from '@mui/material';
import parse from 'html-react-parser';
import { SampleTile } from 'platform/components/Tiles';
import { StyledText } from 'platform/style/StyledMui';
import React from 'react';
import { Animals } from 'shared/handEnums';

function renderTiles(tiles: string, parentKey: string) {
	const cards = tiles.split(',');
	return (
		<div className="small-tiles">
			{cards.map((card, index) => {
				const isAnimal = Animals.includes(card);
				return <SampleTile key={`${parentKey}-${index}`} card={card} border={isAnimal} gold={false} />;
			})}
		</div>
	);
}

function renderSectionPoints(section, index: number, platform: string) {
	return section.points.map((point, index2) => {
		const key = `section-${index}-${index2}`;
		if (point.startsWith('_render_')) {
			const arr = point.slice(8).split('_');
			return (
				<span key={key}>
					{arr.length === 2 ? (
						<>
							{parse(arr[0].replaceAll('{platform}', platform))}
							{renderTiles(arr[1], key)}
						</>
					) : (
						renderTiles(arr[0], key)
					)}
				</span>
			);
		} else {
			return <li key={key}>{parse(point.replaceAll('{platform}', platform))}</li>;
		}
	});
}

export default function renderSections(
	sections: IHelpItem[],
	showContent: number,
	toggleShow: (i: number) => void,
	overlayTimeout: number,
	platform: string
) {
	return sections.map((section, index) => {
		const show = showContent === -1 || index === showContent;
		return (
			<Fade key={index} in={show} timeout={overlayTimeout}>
				<div>
					<Accordion expanded={index === showContent} onChange={() => toggleShow(index)}>
						<AccordionSummary expandIcon={<ChevronRightIcon />} style={{ height: 40 }}>
							<StyledText text={section.title.replaceAll('{platform}', platform)} variant="body1" />
						</AccordionSummary>
						<AccordionDetails
							style={{
								maxHeight:
									'calc(100vh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
								overflow: 'scroll'
							}}
						>
							<div className="content-wrapper">
								<ul>{renderSectionPoints(section, index, platform)}</ul>
							</div>
						</AccordionDetails>
					</Accordion>
				</div>
			</Fade>
		);
	});
}
