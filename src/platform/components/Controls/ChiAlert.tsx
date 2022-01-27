import { IconButton } from '@mui/material';
import { Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag } from 'shared/enums';
import { ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { getCardName } from 'shared/util';

interface IChiAlertProps {
	show: boolean;
	hide?: () => void;
}

const foodEmojis = ['🍜', '🥞', '🥘', '🍕', '🍣', '🥮', '🧁', '🍩', '🍢', '🍙', '🍫', '🥟'];
function getRandomFoodEmoji() {
	return foodEmojis[Math.floor(Math.random() * 10)];
}

const ChiAlert = ({ hide, show }: IChiAlertProps) => {
	const {
		theme: { tableColor },
		game,
		localGame,
		gameId
	} = useSelector((store: IStore) => store);
	const currGame = gameId === LocalFlag ? localGame : game;
	const cardName = currGame?.lTh?.c ? getCardName(currGame.lTh.c) : '';
	const [foodEmoji, setFoodEmoji] = useState(getRandomFoodEmoji());

	useEffect(() => {
		!show && setTimeout(() => setFoodEmoji(foodEmojis[Math.floor(Math.random() * 10)]), 1000);
	}, [show]);

	return (
		<Row className={`chi-alert ${show ? '' : 'hide'}`} style={{ backgroundColor: tableColor }}>
			<StyledText text={`${ScreenTextEng.CHI_ALERT} ${cardName}`} variant="body1" />
			<IconButton className="icon-button" onClick={hide} disableRipple>
				<StyledText text={`${foodEmoji}`} variant="body1" />
			</IconButton>
		</Row>
	);
};

export default ChiAlert;
