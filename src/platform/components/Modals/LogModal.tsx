import { useCloseListener } from 'platform/hooks';
import { GreenTableText, TableText } from 'platform/style/StyledComponents';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag, Size, TableColor, Transition } from 'shared/enums';
import { ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';

interface ILogModalP {
	expanded: boolean;
	onClose: () => void;
	externalRef?: React.MutableRefObject<any>;
	size: Size;
	tableColor: TableColor;
}

function compare(prev: ILogModalP, next: ILogModalP) {
	return prev.size === next.size && prev.expanded === next.expanded && prev.tableColor === next.tableColor;
}

const LogModal = (props: ILogModalP) => {
	const { expanded, onClose, externalRef, size, tableColor } = props;
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
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

	return (
		<div
			id={id}
			ref={modalRef}
			className={`log-box-${size || Size.MEDIUM}${expanded ? ` expanded` : ``}`}
			style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
		>
			{currGame?.logs.map((log: string, index) =>
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

export default memo(LogModal, compare);
