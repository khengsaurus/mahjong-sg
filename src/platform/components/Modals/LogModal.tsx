import { useEventListener } from 'platform/hooks';
import { GreenTableText, TableText } from 'platform/style/StyledComponents';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag, Size, TableColor } from 'shared/enums';
import { IStore } from 'shared/store';

interface LogModalProps {
	expanded: boolean;
	onClose: () => void;
	externalRef?: React.MutableRefObject<any>;
	size: Size;
	tableColor: TableColor;
}

function compare(prev: LogModalProps, next: LogModalProps) {
	return prev.size === next.size && prev.expanded === next.expanded && prev.tableColor === next.tableColor;
}

const LogModal = (props: LogModalProps) => {
	const { expanded, onClose, externalRef, size, tableColor } = props;
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const isLocalGame = gameId === LocalFlag;
	const currGame = isLocalGame ? localGame : game;
	const modalRef = useRef(null);
	const id = 'logBox';

	const scroll = useCallback(() => {
		const logsList = document.getElementById(id);
		if (logsList) {
			logsList.scrollTop = logsList.scrollHeight;
		}
	}, [id]);

	useEventListener(expanded, onClose, modalRef, externalRef);

	useEffect(() => {
		scroll();
	}, [currGame?.logs?.length, expanded, scroll]);

	return (
		<div
			id={id}
			ref={modalRef}
			className={`log-box-${size || Size.MEDIUM}${expanded ? ` expanded` : ``}`}
			style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
		>
			{currGame?.logs.map((log: string, index) =>
				log.includes('sent') ? (
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
