import isEmpty from 'lodash/isEmpty';
import { isDev } from 'platform';
import { useRef, useEffect, useState } from 'react';

// https://usehooks.com/useDebounce/
function useDebounce<P, R>(callback: (p?: P) => Promise<R>, args: P, delay = 500) {
	const [results, setResults] = useState<R>(null);
	const [debouncedArgs, setDebouncedArgs] = useState<P>(null);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		if (!isEmpty(debouncedArgs)) {
			try {
				callback(debouncedArgs).then(results => setResults(results));
			} catch (err) {
				isDev && console.error(err);
				setResults(null);
			}
		} else {
			setResults(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(debouncedArgs), callback]);

	useEffect(() => {
		if (isEmpty(debouncedArgs)) {
			setDebouncedArgs(args);
		} else {
			timeoutRef.current = setTimeout(() => setDebouncedArgs(args), delay);
		}

		return () => {
			clearTimeout(timeoutRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(args), delay]);

	return { results };
}

export default useDebounce;
