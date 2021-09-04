import { useContext, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Sizes } from '../../global/enums';
import { TableColoredDiv } from '../../global/styles';
import { AppContext } from '../../util/hooks/AppContext';
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
	const { tableColor } = useContext(AppContext);
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
		<TransitionGroup>
			<div
				id="logs"
				className={`log-box-${size || Sizes.medium}${expanded ? ` expanded` : ``}`}
				style={{ backgroundColor: expanded ? tableColor : 'transparent' }}
			>
				{logRef.current.map((log: Log, index) => {
					return (
						<CSSTransition key={`${index}`} timeout={250} classNames="move">
							<div className={log.msg.includes('sent') ? 'log pay' : 'log'}>{log.msg}</div>
						</CSSTransition>
					);
				})}
			</div>
		</TransitionGroup>
	);
};

export default LogBox;
