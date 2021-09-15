import { useCallback, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from '../../global/enums';
import { TableText } from '../../global/StyledComponents';
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

const LogBox = (props: LogBoxProps) => {
	const { id, logs, expanded, size, tableColor } = props;
	const logRef = useRef<ILog[]>([]);

	const scrollToBottomOfDiv = useCallback(() => {
		try {
			let logsList = document.getElementById(id);
			logsList.scrollTop = logsList.scrollHeight + 10;
		} catch (err) {
			console.log(`Element with id '${id}' not found`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, expanded]);

	useEffect(() => {
		if (logRef.current.length > 100) {
			logRef.current = logs;
		} else {
			logs.forEach(log => {
				if (!logRef.current.includes(log)) {
					logRef.current = [...logRef.current, log];
				}
			});
		}
		scrollToBottomOfDiv();
	}, [logs, scrollToBottomOfDiv]);

	return (
		<TransitionGroup
			id={id}
			className={`log-box-${size || Sizes.medium}${expanded ? ` expanded` : ``}`}
			style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
		>
			{logRef.current.map((log: ILog, index) => {
				return (
					<CSSTransition key={`${index}`} timeout={250} classNames="move">
						<TableText>{log.msg}</TableText>
					</CSSTransition>
				);
			})}
		</TransitionGroup>
	);
};

export default LogBox;
