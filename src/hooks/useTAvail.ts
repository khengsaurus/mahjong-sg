import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag } from 'enums';
import { IStore } from 'store';
import { isEmptyTile } from 'utility';

const useTAvail = () => {
	const { game, gameId, localGame } = useSelector((state: IStore) => state);
	const { f = [], hu, lTh, n = [], ps } = gameId === LocalFlag ? localGame : game;
	const ref1 = ps[n[7]]?.dTs?.slice(-1)[0]?.r;
	const ref2 = ps[Number(hu[0]) || n[7]]?.lTa?.r;

	const { lThAvail, lThAvailHu } = useMemo(
		() => {
			const lThAvailHu =
				!isEmptyTile(lTh) &&
				// thB's last discarded tile is lTh || hu _p's lTa = lTh || thB's lTa === lTh
				(ps[n[7]]?.lastDiscardedTileIs(lTh) || ps[hu[Number(0)] || n[7]]?.lTa?.r === lTh?.r);

			// and not taken
			const lThAvail = lThAvailHu && !f[3];

			return { lThAvail, lThAvailHu };
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[f[3], lTh?.r, ref1, ref2, n[7]]
	);

	return { lThAvail, lThAvailHu };
};

export default useTAvail;
