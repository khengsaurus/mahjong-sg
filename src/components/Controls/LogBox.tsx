import { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes, TableColors } from '../../global/enums';
import { TableText } from '../../global/StyledComponents';
import './controlsLarge.scss';
import './controlsMedium.scss';
import './controlsSmall.scss';

interface LogBoxProps {
	logs: ILog[];
	expanded: boolean;
	scroll: () => void;
	size: Sizes;
	tableColor: TableColors;
}

const LogBox = (props: LogBoxProps) => {
	const { logs, expanded, scroll, size, tableColor } = props;
	const logRef = useRef<ILog[]>([]);

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
		scroll();
	}, [logs, scroll]);

	return (
		<TransitionGroup
			id="logs"
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
