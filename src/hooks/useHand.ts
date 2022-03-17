import { getHands } from 'bot';
import { LocalFlag } from 'enums';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { AppContext } from './AppContext';

export default function useHand(): IUseHand {
	const { playerSeat } = useContext(AppContext);
	const { game, gameId, localGame, tHK } = useSelector((state: IStore) => state);
	const currGame = gameId === LocalFlag ? localGame : game;
	const { lTh, n = [] } = currGame;

	const _pRef = { ...currGame.ps[playerSeat] };
	delete _pRef?.uTs;
	delete _pRef?.sT;
	delete _pRef?.cfH;
	const playerRef = JSON.stringify(_pRef);

	return useMemo(() => {
		if (n[7] === playerSeat) {
			return { HH: {} };
		} else {
			return getHands(currGame, playerSeat, tHK);
		}
		// return n[7] === playerSeat ? { HH: {} } : getHands(currGame, playerSeat, tHK);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lTh?.c, lTh.r, n[7], playerRef, tHK]);
}
