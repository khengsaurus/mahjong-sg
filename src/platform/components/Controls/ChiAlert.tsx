import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag } from 'shared/enums';
import { ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { getCardName, getRandomFoodEmoji, isMobile } from 'shared/util';

interface IChiAlertProps {
	show: boolean;
	ms: IShownTile[][];
	handleTake: (m: string[]) => void;
	onClose: () => void;
	handleOpenOffer: () => void;
}

const ChiAlert = ({ show, ms, handleTake, handleOpenOffer, onClose }: IChiAlertProps) => {
	const {
		theme: { tableColor },
		game,
		localGame,
		gameId
	} = useSelector((store: IStore) => store);
	const currGame = gameId === LocalFlag ? localGame : game;
	const cardName = currGame?.lTh?.c ? getCardName(currGame.lTh.c) : '';
	const [foodEmoji, setFoodEmoji] = useState(getRandomFoodEmoji());
	const closeRef = useRef(null);

	useEffect(() => {
		!show && setTimeout(() => setFoodEmoji(getRandomFoodEmoji), 1000);
	}, [show]);

	function handleClick(e: any) {
		if (!closeRef.current?.contains(e.target)) {
			if (ms.length === 1) {
				handleTake(ms[0].map(t => t.c));
			} else {
				handleOpenOffer();
			}
			onClose();
		}
	}

	return (
		<Row
			className={`chi-alert ${show ? '' : 'hide'}`}
			style={{ backgroundColor: tableColor }}
			onClick={handleClick}
		>
			<StyledText
				text={`${isMobile() ? ScreenTextEng.PRESS : ScreenTextEng.CLICK} ${
					ScreenTextEng.HERE_TO_CHI
				} ${cardName}`}
				variant="body1"
			/>
			<StyledText text={`${foodEmoji}`} variant="body1" />
			<IconButton className="icon-button" onClick={onClose} disableRipple ref={closeRef}>
				<CloseIcon fontSize={'medium'} />
			</IconButton>
		</Row>
	);
};

export default ChiAlert;
