import { IconButton } from '@mui/material';
import { Row } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useEffect, useState } from 'react';
import { ScreenTextEng } from 'shared/screenTexts';

interface IChiAlertProps {
	show: boolean;
	backgroundColor?: string;
	hide?: () => void;
}

const foodEmojis = ['🍜', '🥞', '🥘', '🍕', '🍟', '🍔', '🧁', '🍩', '🍢', '🍙'];
function getRandomFoodEmoji() {
	return foodEmojis[Math.floor(Math.random() * 10)];
}

const ChiAlert = ({ backgroundColor, hide, show }: IChiAlertProps) => {
	const [foodEmoji, setFoodEmoji] = useState(getRandomFoodEmoji());

	useEffect(() => {
		!show && setTimeout(() => setFoodEmoji(foodEmojis[Math.floor(Math.random() * 10)]), 1000);
	}, [show]);

	return (
		<Row className={`chi-alert ${show ? '' : 'hide'}`} style={{ backgroundColor }}>
			<StyledText text={`${ScreenTextEng.CHI_ALERT}`} variant="body1" />
			<IconButton className="icon-button" onClick={hide} disableRipple>
				<StyledText text={`${foodEmoji}`} variant="body1" />
			</IconButton>
		</Row>
	);
};

export default ChiAlert;
