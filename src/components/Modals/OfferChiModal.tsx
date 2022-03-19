import { Dialog, DialogContent } from '@mui/material';
import 'components/PlayerComponents/playerComponents.scss';
import { ShownTile } from 'components/Tiles';
import { Segment } from 'enums';
import { isMobile } from 'platform';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { getHighlightColor } from 'style/MuiStyles';
import { Centered, Column } from 'style/StyledComponents';
import { StyledCenterText } from 'style/StyledMui';

interface IOfferChiModalP {
	show: boolean;
	card: string;
	ms: IShownTile[][];
	handleTake: (m: string[]) => void;
	onClose: () => void;
}

const OfferChiModal = ({ show, card, ms, handleTake, onClose }: IOfferChiModalP) => {
	const {
		theme: { tableColor }
	} = useSelector((state: IStore) => state);
	const title = useMemo(() => `${ScreenTextEng.YOU_CAN_CHI} ${card}`, [card]);

	return (
		<Dialog open={show} BackdropProps={{ invisible: true }} onClose={onClose}>
			<DialogContent style={{ paddingBottom: '10px' }}>
				<StyledCenterText text={title} variant="subtitle1" padding="3px 0px" />
				<Centered>
					<Column>
						{ms.map((m, ix1) => (
							<div
								id={`offer-${ix1}`}
								className={`row-section-large offer${isMobile ? `` : `-hover`}`}
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
