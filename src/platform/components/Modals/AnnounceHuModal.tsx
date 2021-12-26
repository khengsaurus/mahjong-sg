import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { isEmpty } from 'lodash';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import PaymentModalInline from 'platform/components/Modals/PaymentModalInline';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useMemo } from 'react';
import { IAnnounceHuModalProps } from 'shared/typesPlus';
import { getHandDesc, isBefore } from 'shared/util';

const AnnounceHuModal = ({
	game,
	playerSeat,
	show,
	onClose: handleShow,
	HH,
	huFirst,
	nextRound,
	showNextRound,
	updateGame
}: IAnnounceHuModalProps) => {
	const { hu = [], thB = 0, draw = false, on = true, _d = 0 } = game || {};

	const canHuFirst = useMemo((): boolean => {
		const whoHu = Number(hu[0]);
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, thB) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, hu[0] || 0, game?.mHu, HH?.maxPx]);

	return (
		<Dialog
			open={!isEmpty(hu) || draw}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.medium_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: 0 }}>
				{hu.length > 2 ? (
					<>
						<Title
							title={`${hu[0] === playerSeat ? 'You' : game.ps[hu[0]]?.uN} won, with ${hu[1]}台${
								hu[2] === 1 ? ` 自摸` : ``
							}`}
							variant="subtitle1"
							padding="3px 0px"
						/>
						{hu.slice(3, hu.length).map((p: string, ix: number) => {
							return <Title title={`• ${getHandDesc(p)}`} variant="subtitle2" padding="2px" key={ix} />;
						})}
						{hu[0] !== playerSeat && (
							<PaymentModalInline game={game} playerSeat={playerSeat} updateGame={updateGame} />
						)}
					</>
				) : (
					<Centered>
						{draw && <Title title={`Draw!`} variant="h6" />}
						{(!on || _d === 9) && <Title title={`The game has ended!`} variant="h6" />}
					</Centered>
				)}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '0px 8px'
				}}
			>
				<HomeButton />
				{hu[0] !== playerSeat &&
					(canHuFirst ? (
						<StyledButton label={'Hu'} onClick={huFirst} />
					) : (
						<StyledButton label={show ? 'Hide' : 'Show'} onClick={handleShow} />
					))}
				{showNextRound && <StyledButton label={`Next Round`} onClick={nextRound} />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
