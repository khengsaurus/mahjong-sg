import { Fade } from '@mui/material';
import { EEvent, Transition } from 'enums';
import { useDocumentListener } from 'hooks';
import { HomePage, renderDefaultTitle } from 'pages';
import renderSections from 'pages/Misc/Help/renderFunctions';
import initContent from 'pages/Misc/initContent.json';
import 'pages/Misc/misc.scss';
import { platform } from 'platform';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'screenTexts';
import { IStore } from 'store';

const Help = () => {
	const { helpContent } = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const [showContent, setShowContent] = useState(-1);
	const hasToggledRef = useRef(false);

	const handleCloseCallback = useCallback(e => {
		if (e.key === 'Escape') {
			setShowContent(-1);
		}
	}, []);

	useDocumentListener(EEvent.KEYDOWN, handleCloseCallback);

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
			{renderSections(sections, showContent, toggleShow, overlayTimeout, platform)}
		</div>
	);

	return (
		<HomePage
			markup={markup}
			misc={2}
			customBack={showContent !== -1 ? () => setShowContent(-1) : null}
			skipVerification
		/>
	);
};

export default Help;
