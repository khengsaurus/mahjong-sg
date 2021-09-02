import { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes } from '../../Globals';
import './ControlsLarge.scss';
import './ControlsMedium.scss';
import './ControlsSmall.scss';

interface LogBoxProps {
	logs: Log[];
	expanded: boolean;
	scroll: () => void;
	size: Sizes;
}

const LogBox = (props: LogBoxProps) => {
	const { logs, expanded, scroll, size } = props;
	const logRef = useRef<Log[]>([]);

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
		<TransitionGroup className={`log-box-${size || Sizes.medium}${expanded ? ` expanded` : ``}`} id="logs">
			{logRef.current.map((log: Log, index) => {
				return (
					<CSSTransition key={`${index}`} timeout={250} classNames="move">
						<div
							className={
								log.msg.includes('sent') ? 'log pay' : log.msg.includes('turn') ? 'log turn' : 'log'
							}
						>
							{log.msg}
						</div>
					</CSSTransition>
				);
			})}
		</TransitionGroup>
	);
};

export default LogBox;
