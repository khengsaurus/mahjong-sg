import { useCallback, useEffect, useRef, useState } from 'react';
import { addSecondsToDate } from 'utility';

const useCountdown = (from: Date, delay: number, interval = 200, callback?: () => any) => {
	const fromString = from?.toString() || '';
	const [delayOn, setDelayOn] = useState(false);
	const [delayLeft, setDelayLeft] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout>();

	const startCountdown = useCallback(
		(till: Date) => {
			intervalRef.current = setInterval(() => {
				const now = new Date();
				const seconds = Math.floor(((till.getTime() - now.getTime()) % (1000 * 60)) / 1000);
				if (seconds <= 0) {
					setDelayLeft(0);
					setDelayOn(false);
					callback && callback();
					clearInterval(intervalRef.current);
				} else {
					setDelayLeft(seconds);
				}
			}, interval);
		},
		[interval, callback]
	);

	useEffect(() => {
		if (fromString) {
			let till = addSecondsToDate(from, delay);
			if (till > new Date()) {
				setDelayOn(true);
				startCountdown(till);
			}
		} else {
			setDelayOn(false);
			setDelayLeft(0);
			clearInterval(intervalRef.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromString, delay, startCountdown]);

	return { delayOn, delayLeft };
};

export default useCountdown;
