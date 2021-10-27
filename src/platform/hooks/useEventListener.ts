import { useCallback, useEffect } from 'react';

function useEventListener(
	show: boolean,
	onClose: () => void,
	mainRef: React.MutableRefObject<any>,
	externalRef?: React.MutableRefObject<any>,
	escape: boolean = true
) {
	const handleCloseCallback = useCallback(
		e => {
			if (
				e.key === 'Escape' ||
				(mainRef.current &&
					!mainRef.current?.contains(e.target) &&
					externalRef &&
					externalRef.current &&
					!externalRef.current?.contains(e.target))
			) {
				if (show) {
					onClose();
				}
			}
		},
		[show, onClose, mainRef, externalRef]
	);

	useEffect(() => {
		document.addEventListener('mousedown', handleCloseCallback);
		escape && document.addEventListener('keydown', handleCloseCallback);

		return () => {
			document.removeEventListener('mousedown', handleCloseCallback);
			escape && document.removeEventListener('keydown', handleCloseCallback);
		};
	}, [mainRef, handleCloseCallback, escape]);
}

export default useEventListener;
