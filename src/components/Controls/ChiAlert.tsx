import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Row } from 'style/StyledComponents';
import { StyledText } from 'style/StyledMui';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag } from 'enums';
import { ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { getCardName, getRandomFoodEmoji } from 'utility';

interface IChiAlertP {
	show: boolean;
	onClose: () => void;
	handleOpenOffer: () => void;
}

const ChiAlert = ({ show, handleOpenOffer, onClose }: IChiAlertP) => {
	const {
		theme: { tableColor, enOnly = false },
		game,
		localGame,
		gameId
	} = useSelector((store: IStore) => store);
	const currGame = gameId === LocalFlag ? localGame : game;
	const cardName = currGame?.lTh?.c ? getCardName(currGame.lTh.c, enOnly) : '';
	const [foodEmoji, setFoodEmoji] = useState(getRandomFoodEmoji());
	const closeRef = useRef(null);

	useEffect(() => {
		show && setFoodEmoji(getRandomFoodEmoji());
	}, [show]);

	function handleClick(e: any) {
		if (!closeRef.current?.contains(e.target)) {
			handleOpenOffer();
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
				text={`${ScreenTextEng.YOU_CAN_CHI} ${cardName}`}
				variant="body1"
			/>
			<StyledText text={`${foodEmoji}`} variant="body1" />
			<IconButton
				className="icon-button"
				onClick={onClose}
				disableRipple
				ref={closeRef}
			>
				<CloseIcon fontSize={'medium'} />
			</IconButton>
		</Row>
	);
};

export default ChiAlert;
