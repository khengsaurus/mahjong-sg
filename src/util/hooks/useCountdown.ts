import { useCallback, useEffect, useRef, useState } from 'react';
import { addSecondsToDate } from '../utilFns';

const useCountdown = (from: Date, delay: number, interval = 200) => {
	const fromString = from.toString();
	const [delayOn, setDelayOn] = useState(false);
	const [delayLeft, setDelayLeft] = useState(delay - 1);
	const intervalRef = useRef<NodeJS.Timeout>();

	const startCountdown = useCallback(
		(till: Date) => {
			intervalRef.current = setInterval(() => {
				const now = new Date();
				const seconds = Math.floor(((till.getTime() - now.getTime()) % (1000 * 60)) / 1000);
				if (seconds <= 0) {
					setDelayLeft(delay - 1);
					setDelayOn(false);
					clearInterval(intervalRef.current);
				} else {
					setDelayLeft(seconds);
				}
			}, interval);
		},
		[interval, delay]
	);

	useEffect(() => {
		let till = addSecondsToDate(from, delay);
		if (till > new Date()) {
			setDelayOn(true);
			startCountdown(till);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromString, delay, startCountdown]);

	return { delayOn, delayLeft };
};

export default useCountdown;
