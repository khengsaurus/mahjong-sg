import { EEvent } from 'enums';
import { useCallback, useEffect } from 'react';

function useDocumentListener(event: EEvent, callback: (p?: any) => any, apply = true) {
	useEffect(() => {
		apply && callback && document.addEventListener(event, callback);

		return () => apply && callback && document.removeEventListener(event, callback);
	}, [apply, event, callback]);
}

function useWindowListener(event: EEvent, callback: (p?: any) => any, apply = true) {
	useEffect(() => {
		apply && callback && window.addEventListener(event, callback);

		return () => apply && callback && window.removeEventListener(event, callback);
	}, [apply, event, callback]);
}

function useCloseListener(
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
	useDocumentListener(EEvent.MOUSEDOWN, handleCloseCallback);
	useDocumentListener(EEvent.KEYDOWN, handleCloseCallback, escape);
}

export { useCloseListener, useDocumentListener, useWindowListener };
