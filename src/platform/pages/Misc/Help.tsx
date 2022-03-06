import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary, Fade } from '@mui/material';
import parse from 'html-react-parser';
import { ShownTile } from 'platform/components/Tiles';
import { useDocumentListener } from 'platform/hooks';
import HomePage, { renderDefaultTitle } from 'platform/pages/Home/HomePage';
import { StyledText } from 'platform/style/StyledMui';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { EEvent, ShownTileHeight, ShownTileWidth, Transition } from 'shared/enums';
import { Animals } from 'shared/handEnums';
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

	const handleCloseCallback = useCallback(e => {
		if (e.key === 'Escape') {
			setShowContent(-1);
		}
	}, []);

	useDocumentListener(EEvent.KEYDOWN, handleCloseCallback);

	function renderTiles(tiles: string, parentKey: string) {
		const cards = tiles.split(',');
		return (
			<div className="small-tiles">
				{cards.map((card, index) => {
					const isAnimal = Animals.includes(card);
					return (
						<ShownTile
							key={`${parentKey}-${index}`}
							tileRef={index}
							tileCard={card}
							htsStyle={{
								backgroundColor: 'gainsboro',
								height: ShownTileHeight.SMALL - (isAnimal ? 2 : 0),
								width: ShownTileWidth.SMALL - (isAnimal ? 2 : 0),
								border: isAnimal ? '1px solid rgb(28, 28, 28)' : null,
								borderRadius: 'calc(min(10%, 4px))'
							}}
						/>
					);
				})}
			</div>
		);
	}

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
											{section.points.map((point, index2) => {
												const key = `section-${index1}-${index2}`;
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
													return (
														<li key={key}>
															{parse(point.replaceAll('{platform}', platform))}
														</li>
													);
												}
											})}
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
