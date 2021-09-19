import React, { useCallback, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from '../../global/enums';
import { GreenTableText, TableText } from '../../global/StyledComponents';
import './controlsLarge.scss';
import './controlsMedium.scss';
import './controlsSmall.scss';

interface LogBoxProps {
	id: string;
	logs: ILog[];
	expanded: boolean;
	size: Sizes;
	tableColor: TableColors;
}

function compare(prev: LogBoxProps, next: LogBoxProps) {
	return (
		prev.id === next.id &&
		prev.logs.length === next.logs.length &&
		prev.expanded === next.expanded &&
		prev.size === next.size &&
		prev.tableColor === next.tableColor
	);
}

const LogBox = (props: LogBoxProps) => {
	const { id, logs, expanded, size, tableColor } = props;

	const scrollToBottomOfDiv = useCallback(() => {
		try {
			let logsList = document.getElementById(id);
			logsList.scrollTop = logsList.scrollHeight + 10;
		} catch (err) {
			console.log(`Element with id '${id}' not found`);
		}
	}, [id]);

	useEffect(() => {
		scrollToBottomOfDiv();
	}, [logs, scrollToBottomOfDiv]);

	return (
		<TransitionGroup
			id={id}
			className={`log-box-${size || Sizes.medium}${expanded ? ` expanded` : ``}`}
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

export default React.memo(LogBox, compare);
