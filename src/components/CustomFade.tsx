import { TransitionSpeed } from 'enums';
import { useMemo } from 'react';
import '../App.scss';

interface ITimeout {
	enter?: string | number;
	exit?: string | number;
}

interface IFade {
	show?: boolean;
	timeout?: string | number | ITimeout;
	children?: any;
}

const CustomFade = ({
	show = true,
	timeout = TransitionSpeed.MEDIUM,
	children
}: IFade) => {
	const { timeoutEnter, timeoutExit } = useMemo(() => {
		let timeoutEnter = TransitionSpeed.MEDIUM as string;
		let timeoutExit = TransitionSpeed.INSTANT as string;
		switch (typeof timeout) {
			case 'number':
				timeoutEnter = timeout + 'ms';
				timeoutExit = timeout + 'ms';
				break;
			case 'string':
				timeoutEnter = timeout;
				timeoutExit = timeout;
				break;
			case 'object':
				timeoutEnter =
					timeout.enter + (typeof timeout.enter === 'string' ? '' : 'ms');
				timeoutExit =
					timeout.exit + (typeof timeout.exit === 'string' ? '' : 'ms');
				break;
			default:
				break;
		}
		return { timeoutEnter, timeoutExit };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(timeout)]);

	return (
		<div
			className={'fade' + (show ? ' show' : '')}
			style={{ transition: show ? timeoutEnter : timeoutExit }}
		>
			{children}
		</div>
	);
};

export default CustomFade;
