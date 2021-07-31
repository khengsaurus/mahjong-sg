import React, { useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Controls.scss';

interface LogBoxProps {
	logs: string[];
	expanded: boolean;
}

const LogBox = (props: LogBoxProps) => {
	const { logs, expanded } = props;
	const logRef = useRef<string[]>([]);

	function scrollToBottom() {
		var logsList = document.getElementById('logs');
		logsList.scrollTop = logsList.scrollHeight + 10;
	}

	useEffect(() => {
		logs.forEach(log => {
			if (!logRef.current.includes(log)) {
				logRef.current = [...logRef.current, log];
			}
		});
	}, [logs]);

	useEffect(() => {
		scrollToBottom();
	}, [logs, expanded]);

	return (
		<TransitionGroup className={expanded ? 'log-box expanded' : 'log-box'} id="logs">
			{logRef.current.length > 0 &&
				logRef.current.map((log: string, index) => {
					return (
						<CSSTransition key={index} timeout={250} classNames="move">
							<div
								id={`${index}`}
								className={log.includes('paid') ? 'log pay' : log.includes('move') ? 'log turn' : 'log'}
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
