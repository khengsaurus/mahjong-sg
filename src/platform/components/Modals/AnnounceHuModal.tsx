import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { isEmpty } from 'lodash';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import PaymentModalInline from 'platform/components/Modals/PaymentModalInline';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { AnnounceHuModalProps } from 'shared/typesPlus';
import { getHandDesc, isBefore } from 'shared/util';
import SentLogs from './SentLogs';

const AnnounceHuModal = ({
	game,
	playerSeat,
	show,
	HH,
	huFirst,
	nextRound,
	showNextRound,
	updateGame,
	onClose: handleShow
}: AnnounceHuModalProps) => {
	const user = useSelector((store: IStore) => store.user);
	const { hu = [], thB = 0, draw = false, on = true, _d = 0, ps, logs } = game || {};

	const canHuFirst = useMemo((): boolean => {
		const whoHu = Number(hu[0]);
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, thB) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, hu[0] || 0, game?.mHu, HH?.maxPx]);

	const sentLogs = useMemo(() => {
		const huLogIndex = logs?.findIndex(l => l.includes('hu with'));
		const sent = logs?.slice(huLogIndex)?.filter(log => log.includes('sent')) || [];
		return sent.map(log => log.replace(user?.uN, 'you'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logs?.length]);

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
				{hu.length > 2 && (
					<>
						<StyledText
							title={`${hu[0] === playerSeat ? 'You' : ps[hu[0]]?.uN} won with ${hu[1]}台${
								hu[2] === 1 ? ` 自摸` : ``
							}`}
							variant="subtitle1"
							padding="3px 0px 0px"
						/>
						{hu[2] === 0 && thB !== Number(hu[0]) && (
							<StyledText
								title={`Last tile thrown by ${ps[thB]?.uN}`}
								variant="subtitle2"
								padding="0px"
							/>
						)}
						{hu.slice(3, hu.length).map((p: string, ix: number) => {
							return (
								<StyledText title={`• ${getHandDesc(p)}`} variant="subtitle2" padding="2px" key={ix} />
							);
						})}
						<SentLogs logs={sentLogs} />
						{hu[0] !== playerSeat && (
							<PaymentModalInline game={game} playerSeat={playerSeat} updateGame={updateGame} />
						)}
					</>
				)}
				{(draw || !on || _d === 9) &&
					(draw ? (
						<Centered>
							<StyledText title={`Draw!`} variant="h6" padding="6px" />
							<StyledText title={`15 tiles left`} variant="subtitle1" padding="0px" />
						</Centered>
					) : (
						<StyledText title={`The game has ended!`} variant="subtitle1" padding="6px 0px 0px" />
					))}
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
						<StyledButton label={ButtonText.HU} onClick={huFirst} />
					) : (
						!show && <StyledButton label={ButtonText.SHOW} onClick={handleShow} />
					))}
				{/* <StyledButton label={ButtonText.LOGS} onClick={handleLogs} /> */}
				{showNextRound && <StyledButton label={ButtonText.NEXT_ROUND} onClick={nextRound} />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
