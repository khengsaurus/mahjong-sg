import React, { useCallback, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from 'shared/enums';
import useEventListener from 'shared/hooks/useEventListener';
import { GreenTableText, TableText } from 'web/style/StyledComponents';

interface LogModalProps {
	expanded: boolean;
	onClose: () => void;
	externalRef?: React.MutableRefObject<any>;
	logs: ILog[];
	size: Sizes;
	tableColor: TableColors;
}

function compare(prev: LogModalProps, next: LogModalProps) {
	return (
		prev.logs.length === next.logs.length &&
		prev.expanded === next.expanded &&
		prev.size === next.size &&
		prev.tableColor === next.tableColor
	);
}

const LogModal = (props: LogModalProps) => {
	const { expanded, onClose, externalRef, logs = [], size, tableColor } = props;
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
		setTimeout(() => {
			scroll();
		}, 250);
	}, [logs.length, expanded, scroll]);

	return (
		<div ref={modalRef}>
			<TransitionGroup
				id={id}
				className={`log-box-${size || Sizes.MEDIUM}${expanded ? ` expanded` : ``}`}
				style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
			>
				{logs.map((log: ILog, index) => {
					return (
						<CSSTransition key={`${index}`} timeout={500} classNames="move">
							{log.msg.includes('sent') ? (
								<GreenTableText>{log.msg}</GreenTableText>
							) : (
								<TableText>{log.msg}</TableText>
							)}
						</CSSTransition>
					);
				})}
			</TransitionGroup>
		</div>
	);
};

export default React.memo(LogModal, compare);
