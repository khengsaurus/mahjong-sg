import { useContext, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AppContext } from '../../util/hooks/AppContext';
import './ControlsSmall.scss';
import './ControlsMedium.scss';
import './ControlsLarge.scss';

interface LogBoxProps {
	logs: Log[];
	expanded: boolean;
	scroll: () => void;
}

const LogBox = (props: LogBoxProps) => {
	const { controlsSize } = useContext(AppContext);
	const { logs, expanded, scroll } = props;
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
		<TransitionGroup className={`log-box-${controlsSize}${expanded ? ` expanded` : ``}`} id="logs">
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
