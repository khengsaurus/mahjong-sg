import { useEventListener } from 'platform/hooks';
import { GreenTableText, TableText } from 'platform/style/StyledComponents';
import { memo, useCallback, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from 'shared/enums';

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
		prev.size === next.size &&
		prev.expanded === next.expanded &&
		prev.tableColor === next.tableColor &&
		prev.logs.length === next.logs.length
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
				{logs.map((log: ILog, index) => (
					<CSSTransition key={`${index}`} timeout={500} classNames="move">
						{log.msg.includes('sent') ? (
							<GreenTableText>{log.msg}</GreenTableText>
						) : (
							<TableText>{log.msg}</TableText>
						)}
					</CSSTransition>
				))}
			</TransitionGroup>
		</div>
	);
};

export default memo(LogModal, compare);
