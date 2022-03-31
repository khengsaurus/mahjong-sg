import { LocalFlag, Size, TableColor, Transition } from 'enums';
import { useCloseListener } from 'hooks';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { GreenTableText, TableText } from 'style/StyledComponents';
import { convertToEn } from 'utility';

interface ILogModalP {
	expanded: boolean;
	onClose: () => void;
	externalRef?: React.MutableRefObject<any>;
}

const LogModal = (props: ILogModalP) => {
	const { expanded, onClose, externalRef } = props;
	const {
		game,
		gameId,
		localGame,
		theme: { tableColor = TableColor.GREEN, enOnly = false },
		sizes: { controlsSize = Size.MEDIUM }
	} = useSelector((store: IStore) => store);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const modalRef = useRef(null);
	const id = 'log-box';
	useCloseListener(expanded, onClose, modalRef, externalRef);

	const scroll = useCallback(() => {
		const logsList = document.getElementById(id);
		if (logsList) {
			logsList.scrollTop = logsList.scrollHeight;
		}
	}, [id]);

	// Seems to be more consistent when these are in diff UE's
	useEffect(() => scroll(), [currGame?.logs?.length, scroll]);

	useEffect(() => {
		setTimeout(() => scroll(), Transition.FAST);
	}, [expanded, scroll]);

	const logs = useMemo(() => {
		return currGame?.logs.map(log => (enOnly ? convertToEn(log) : log));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enOnly, JSON.stringify(currGame?.logs)]);

	return (
		<div
			id={id}
			ref={modalRef}
			className={`log-box-${controlsSize}${expanded ? ` expanded` : ``}`}
			style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
		>
			{logs.map((log: string, index) =>
				log.includes('sent ') && log.includes(ScreenTextEng._CHIP_) ? (
					<GreenTableText key={index}>{log}</GreenTableText>
				) : (
					<TableText key={index} style={{ marginLeft: 5, marginRight: 5 }}>
						{log}
					</TableText>
				)
			)}
		</div>
	);
};

export default memo(LogModal);
