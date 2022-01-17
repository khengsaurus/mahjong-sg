import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { isEmpty } from 'lodash';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import PaymentModalInline from 'platform/components/Modals/PaymentModalInline';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered, Column, Row } from 'platform/style/StyledComponents';
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
	showNextRound,
	huFirst,
	nextRound,
	onClose: handleShow
}: AnnounceHuModalProps) => {
	const user = useSelector((store: IStore) => store.user);
	const { hu = [], thB = 0, draw = false, on = true, _d = 0, ps, logs, lTh } = game || {};
	const whoHu = Number(hu[0]);
	const hasHandDescs = hu.length > 3;

	const canHuFirst = useMemo((): boolean => {
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, thB) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, whoHu, game?.mHu, HH?.maxPx]);

	const sentLogs = useMemo(() => {
		const huLogIndex = logs?.findIndex(l => l.includes('hu with'));
		const sent = logs?.slice(huLogIndex)?.filter(log => log.includes('sent')) || [];
		return sent.map(log => {
			return log.replace(user?.uN, log.startsWith(user?.uN) ? 'You' : 'you');
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logs?.length]);

	function renderHandDesc() {
		return hu
			.slice(3, hu.length)
			.map((p: string, ix: number) => (
				<StyledText
					key={ix}
					title={`• ${getHandDesc(p)}`}
					style={{ placeSelf: 'flex-start' }}
					variant="body2"
				/>
			));
	}

	return (
		<Dialog
			open={!isEmpty(hu) || draw}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.annouce_hu_dialog
				}
			}}
		>
			<DialogContent style={{ padding: '10px 15px 0 15px' }}>
				{hu.length > 2 && (
					<>
						<StyledText
							title={`${hu[0] === playerSeat ? 'You' : ps[hu[0]]?.uN} won with ${hu[1]}台${
								hu[2] === 1 ? ` 自摸` : ``
							}`}
							variant="subtitle1"
							padding="2px"
						/>
						{Number(hu[2]) === 0 && thB !== Number(hu[0]) && !isEmpty(lTh) && (
							<StyledText
								title={`Last tile thrown by ${thB === playerSeat ? 'you' : ps[thB]?.uN}`}
								variant="body2"
								padding="0px 0px 3px"
							/>
						)}
						<Row style={{ justifyContent: 'flex-start' }}>
							{hasHandDescs && (
								<Column
									style={{
										justifyContent: 'flex-start',
										paddingRight: 20,
										maxWidth: '200px !important'
									}}
								>
									{renderHandDesc()}
								</Column>
							)}
							<Column
								style={{
									alignItems: 'flex-end',
									justifyContent: 'flex-start',
									maxWidth: '200px !important'
								}}
							>
								<SentLogs logs={sentLogs} align={hasHandDescs ? 'right' : 'left'} />
								{hu[0] !== playerSeat && (
									<PaymentModalInline
										game={game}
										playerSeat={playerSeat}
										alignPayModal={hasHandDescs ? 'end' : 'start'}
									/>
								)}
							</Column>
						</Row>
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
					padding: '0px 6px'
				}}
			>
				<HomeButton style={{ padding: '8px' }} />
				{hu[0] !== playerSeat &&
					(canHuFirst ? (
						<StyledButton label={ButtonText.HU} onClick={huFirst} padding="8px" />
					) : (
						!show && <StyledButton label={ButtonText.SHOW} onClick={handleShow} padding="8px" />
					))}
				{/* <StyledButton label={ButtonText.LOGS} onClick={handleLogs} /> */}
				{showNextRound && <StyledButton label={ButtonText.NEXT_ROUND} onClick={nextRound} padding="8px" />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
