import { Game } from 'models';
import { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { IControlsTop } from 'typesPlus';
import { getCardName, indexToWind } from 'utility';
import { AppContext } from './AppContext';

function useControlsTop(updateGame: (game: Game) => void): IControlsTop {
	const { currGame, playerSeat } = useContext(AppContext);
	const {
		theme: { enOnly = false }
	} = useSelector((state: IStore) => state);

	const [showPay, setShowPay] = useState(false);
	const [showLogs, setShowLogs] = useState(false);
	const [showText, setShowText] = useState(true);
	const [showAdmin, setShowAdmin] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showLeaveAlert, setShowLeaveAlert] = useState(false);

	// Consts
	const { f, n = [], prE, ps, ts } = currGame;
	const player = ps[playerSeat];
	const dealerName = ps[prE._d || n[2]]?.uN;

	const seat = useMemo(() => {
		const wind = indexToWind((playerSeat - n[2] + 4) % 4);
		return getCardName(wind, enOnly);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enOnly, playerSeat, n[2]]);

	const texts = useMemo(
		() =>
			f[0]
				? [
						// `Dealer: ${dealerName}`,
						`Seat: ${seat}, ${ScreenTextEng.CHIPS}: ${
							Math.round(player?.bal) || 0
						}`,
						`${ts?.length || 0} tiles left`,
						`${
							n[3] === playerSeat
								? ScreenTextEng.YOUR_TURN
								: `${ps[n[3]]?.uN}'s turn`
						}`
				  ]
				: [
						`${ScreenTextEng.CHIPS}: ${Math.round(player?.bal) || 0}`,
						ScreenTextEng.GAME_ENDED
				  ],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dealerName, f[0], player?.bal, playerSeat, ps[n[3]]?.uN, ts?.length, seat]
	);

	return {
		topRight: {
			toggleShowPay: () => setShowPay(prev => !prev),
			toggleShowLogs: () => setShowLogs(prev => !prev),
			showText,
			showLogs
		},
		topLeft: {
			toggleShowSettings: () => setShowSettings(prev => !prev),
			toggleShowScreenText: () => setShowText(prev => !prev),
			toggleShowAdmin: () => setShowAdmin(prev => !prev),
			setShowLeaveAlert,
			showText,
			texts
		},
		payModal: {
			game: currGame,
			playerSeat,
			show: showPay,
			updateGame,
			onClose: () => setShowPay(false)
		},
		settingsModal: {
			game: currGame,
			playerSeat,
			show: showSettings,
			onClose: () => setShowSettings(false)
		},
		gameInfoModal: {
			game: currGame,
			show: showAdmin,
			updateGame,
			onClose: () => setShowAdmin(false)
		},
		showLeaveAlert,
		setShowPay
	};
}

export default useControlsTop;
