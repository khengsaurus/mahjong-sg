import { getHands } from 'bot';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { AppContext } from './AppContext';

export default function useHand(): IUseHand {
	const { currGame, playerSeat } = useContext(AppContext);
	const { tHK } = useSelector((state: IStore) => state);
	const { lTh, n = [], ps = [] } = currGame;
	const { ms, hTs, lTa } = ps[playerSeat] || {};

	const _pRef = [...ms, ...hTs.map(t => t.r), lTa?.r].join('');

	return useMemo(() => {
		if (n[3] !== playerSeat && n[7] === playerSeat) {
			return { HH: {} };
		} else {
			return getHands(currGame, playerSeat, tHK);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lTh?.c, lTh?.r, n[7], _pRef, tHK]);
}
