import React, { useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from '../../global/enums';
import { GreenTableText, TableText } from '../../global/StyledComponents';

interface LogModalProps {
	logs: ILog[];
	expanded: boolean;
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
	const { logs = [], expanded, size, tableColor } = props;
	const id = 'logBox';

	function scroll() {
		const logsList = document.getElementById(id);
		if (logsList) {
			logsList.scrollTop = logsList.scrollHeight;
		}
	}

	useEffect(() => {
		scroll();
	}, [logs.length, expanded]);

	return (
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
	);
};

export default React.memo(LogModal, compare);
