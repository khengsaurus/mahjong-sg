import { User } from 'models';
import { useCallback, useEffect, useState } from 'react';
import { findLeft, sortTiles, tilesCanBeChi, tilesCanBePong } from 'utility';

const useOptions = (
	player: User,
	selectedTiles: IShownTile[],
	lTh: IShownTile,
	taken: boolean,
	thrownBy: number,
	whoseMove: number,
	playerSeat: number,
	lThAvail
) => {
	const [canChi, setCanChi] = useState(false);
	const [canPong, setCanPong] = useState(false);
	const [canKang, setCanKang] = useState(false);
	const [meld, setMeld] = useState<IShownTile[]>([]);
	const lThRef = lTh?.c + lTh.r;
	const selectedTsRef = JSON.stringify(selectedTiles.map(t => t.r));

	const setOptions = useCallback(
		(kang: boolean, pong: boolean, chi: boolean, ts: IShownTile[]) => {
			setCanKang(kang);
			setCanPong(pong);
			setCanChi(chi);
			setMeld(ts);
		},
		[setCanKang, setCanPong, setCanChi, setMeld]
	);

	useEffect(() => {
		let tiles: IShownTile[] = [];
		if (whoseMove === playerSeat && (selectedTiles.length === 1 || selectedTiles.length === 4) && taken) {
			// Can self kang during turn & selecting 1 || 4
			setOptions(player?.canKang(selectedTiles), false, false, selectedTiles);
		} else if (lThAvail && selectedTiles.length === 3) {
			// Can kang during anyone's turn if last thrown tile available & selecting 3
			tiles = [lTh, ...selectedTiles];
			setOptions(player?.canKang(tiles), false, false, tiles);
		} else if (lThAvail && selectedTiles.length === 2) {
			// If last thrown available, can pong during anyone's turn, can chi only during own's turn
			const canPongFlag = tilesCanBePong([lTh, ...selectedTiles]);
			tiles = canPongFlag ? [lTh, ...selectedTiles] : sortTiles([...selectedTiles, lTh]);
			setOptions(
				false,
				canPongFlag,
				thrownBy === findLeft(playerSeat) && whoseMove === playerSeat && tilesCanBeChi(tiles),
				tiles
			);
		} else {
			setOptions(false, false, false, tiles);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taken, lThRef, lThAvail, playerSeat, selectedTsRef, thrownBy, whoseMove]);

	return { canChi, canPong, canKang, meld };
};

export default useOptions;
