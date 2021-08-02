import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Controls.scss';

interface LogBoxProps {
	logs: string[];
	expanded: boolean;
	scroll: () => void;
}

const LogBox = (props: LogBoxProps) => {
	const { logs, expanded, scroll } = props;
	const [displayLogs, setDisplayLogs] = useState<string[]>([]);
	const logRef = useRef<string[]>([]);

	useEffect(() => {
		logs.forEach(log => {
			if (!logRef.current.includes(log)) {
				logRef.current = [...logRef.current, log];
			}
		});
		setDisplayLogs(logRef.current);
	}, [logs]);

	useEffect(() => {
		scroll();
	}, [displayLogs]);

	return (
		<TransitionGroup className={expanded ? 'log-box expanded' : 'log-box'} id="logs">
			{displayLogs.length > 0 &&
				displayLogs.map((log: string, index) => {
					return (
						<CSSTransition key={index} timeout={250} classNames="move">
							<div
								id={`${index}`}
								className={log.includes('sent') ? 'log pay' : log.includes('turn') ? 'log turn' : 'log'}
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
