import { Dialog, DialogContent } from '@mui/material';
import 'platform/components/PlayerComponents/playerComponents.scss';
import { getHighlightColor } from 'platform/style/MuiStyles';
import { Centered, Column } from 'platform/style/StyledComponents';
import { StyledCenterText } from 'platform/style/StyledMui';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Segment } from 'shared/enums';
import { ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { getRandomFoodEmoji, isMobile } from 'shared/util';
import { ShownTile } from '../Tiles';

interface IOfferChiModalProps {
	show: boolean;
	card: string;
	ms: IShownTile[][];
	handleTake: (m: string[]) => void;
	onClose: () => void;
}

const OfferChiModal = ({ show, card, ms, handleTake, onClose }: IOfferChiModalProps) => {
	const {
		theme: { tableColor }
	} = useSelector((state: IStore) => state);
	const title = useMemo(() => `${ScreenTextEng.YOU_CAN_CHI} ${card} ${getRandomFoodEmoji()}`, [card]);

	return (
		<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose}>
			<DialogContent>
				<StyledCenterText text={title} variant="subtitle1" padding="3px 0px" />
				<Centered>
					<Column>
						{ms.map((m, ix1) => (
							<div
								id={`offer-${ix1}`}
								className={`row-section-large offer${isMobile() ? `` : `-hover`}`}
								key={ix1}
								onClick={() => {
									handleTake(m.map(t => t.c));
									onClose();
								}}
								style={{ borderColor: getHighlightColor(tableColor) }}
							>
								{m.map((t, ix2) => (
									<ShownTile
										key={`${ix1}-${ix2}`}
										tileRef={t.r}
										tileCard={t.c}
										segment={Segment.TOP}
									/>
								))}
							</div>
						))}
					</Column>
				</Centered>
			</DialogContent>
		</Dialog>
	);
};

export default OfferChiModal;
