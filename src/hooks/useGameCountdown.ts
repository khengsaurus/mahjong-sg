import { Exec } from 'enums';
import { AppContext } from 'hooks';
import { useContext, useMemo } from 'react';
import useCountdown from './useCountdown';

const useGameCountdown = () => {
	const { currGame } = useContext(AppContext);

	/**
	 * AsCanHu:string[] being players who can hu
	 * BCanHu:string being a player other than AsCanHu[0] who can pong
	 */
	const { AsCanHu, BCanPong = false } = useMemo(() => {
		const AsCanHu = currGame.sk.filter(s => s.includes(Exec.HU));
		const BCanPong =
			AsCanHu.length &&
			currGame.sk.length > 1 &&
			!!currGame.sk.find(s => !s.includes(Exec.HU) && s[0] !== AsCanHu[0][0]);
		return { AsCanHu, BCanPong };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(currGame.sk)]);

	return useCountdown(currGame?.t[2], AsCanHu.length > 1 || BCanPong ? 12 : 6, 200);
};

export default useGameCountdown;
