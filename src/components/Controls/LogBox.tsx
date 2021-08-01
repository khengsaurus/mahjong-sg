import React, { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Controls.scss';

interface LogBoxProps {
	logs: string[];
	expanded: boolean;
	scroll: () => void;
}

const LogBox = (props: LogBoxProps) => {
	const { logs, expanded, scroll } = props;
	const logRef = useRef<string[]>([]);

	useEffect(() => {
		logs.forEach(log => {
			if (!logRef.current.includes(log)) {
				logRef.current = [...logRef.current, log];
			}
		});
		scroll();
	}, [logs, expanded]);

	return (
		<TransitionGroup className={expanded ? 'log-box expanded' : 'log-box'} id="logs">
			{logRef.current.length > 0 &&
				logRef.current.map((log: string, index) => {
					return (
						<CSSTransition key={index} timeout={250} classNames="move">
							<div
								id={`${index}`}
								className={log.includes('paid') ? 'log pay' : log.includes('turn') ? 'log turn' : 'log'}
							>
								{log}
							</div>
						</CSSTransition>
					);
				})}
		</TransitionGroup>
	);
};

export default LogBox;
