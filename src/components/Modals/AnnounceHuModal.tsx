import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { HomeButton, PaymentModalInline, SentLogs } from 'components';
import { LocalFlag, PaymentType } from 'enums';
import { AppContext } from 'hooks';
import isEmpty from 'lodash.isempty';
import { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ButtonText, PaymentLabel, ScreenTextChi, ScreenTextEng } from 'screenTexts';
import { IStore } from 'store';
import { MuiStyles } from 'style/MuiStyles';
import { StyledButton, StyledCenterText } from 'style/StyledMui';
import { IAnnounceHuModalP } from 'typesPlus';
import { getHandDesc, isBefore } from 'utility';
import './announceHuModal.scss';

const AnnounceHuModal = ({
	game,
	playerSeat,
	show,
	HH,
	showNextRound,
	handleHome,
	handleChips,
	huFirst,
	nextRound,
	onClose: handleShow
}: IAnnounceHuModalP) => {
	const { setAnnHuOpen } = useContext(AppContext);
	const {
		user,
		theme: { enOnly }
	} = useSelector((store: IStore) => store);
	const { id, hu = [], f = [], n = [], pay, ps, logs, lTh } = game || {};
	const whoHu = Number(hu[0]);

	useEffect(() => {
		setAnnHuOpen(hu.length > 2 || f[5]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hu.length, f[5], show]);

	const canHuFirst = useMemo((): boolean => {
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, n[7]) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, whoHu, f[6], HH?.maxPx]);

	const sentLogs = useMemo(() => {
		const huLogIndex = logs?.findIndex(l => l.includes('hu with'));
		const sent = logs?.slice(huLogIndex)?.filter(log => log.includes('sent')) || [];
		return sent.map(log =>
			log.replace(user?.uN, log.startsWith(user?.uN) ? 'You' : 'you')
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logs?.length]);

	const hasHandDescs = hu.length > 3;
	const hasRightPanel = whoHu !== playerSeat || sentLogs.length > 0;

	function renderHandDesc() {
		return (
			hu
				.slice(3, hu.length)
				// ['Four Greater Blessings', 'Lots of stuff', '3 Flower Tiles', 'Win on 2nd Replacement Tile']
				.map((p: string, ix: number) => (
					<StyledCenterText
						key={ix}
						// text={p}
						text={getHandDesc(p)}
					/>
				))
		);
	}

	function getPaymentText() {
		switch (pay) {
			case PaymentType.SHOOTER:
				return `${PaymentLabel.s}.`;
			case PaymentType.HALF_SHOOTER:
				return `${PaymentLabel.h}.`;
			default:
				return ``;
		}
	}

	function getLastThrownText() {
		return Number(hu[2]) === 0 && n[7] !== Number(hu[0]) && !isEmpty(lTh)
			? `Last tile thrown by ${n[7] === playerSeat ? 'you' : ps[n[7]]?.uN}.`
			: Number(hu[2] === 1)
			? `${ScreenTextEng.LAST_TILE_SELF_DRAWN}.`
			: ``;
	}

	return (
		<Dialog
			open={!isEmpty(hu) || f[5]}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: MuiStyles.medium_dialog
			}}
		>
			<DialogContent>
				{hu.length > 2 && (
					<>
						<StyledCenterText
							text={`${
								hu[0] === playerSeat ? 'You' : ps[hu[0]]?.uN
							} Hu with ${hu[1]} ${
								enOnly ? ScreenTextEng.TAI : ScreenTextChi.TAI
							}`}
							style={{ paddingBottom: '0px' }}
							variant="body1"
						/>
						<StyledCenterText
							text={`${getPaymentText()} ${getLastThrownText()}`}
						/>
						<div className="ann-panels">
							{hasHandDescs && (
								<div
									className={
										hasRightPanel ? 'left-panel' : 'full-panel'
									}
								>
									{renderHandDesc()}
								</div>
							)}
							<div className={hasHandDescs ? `right-panel` : `full-panel`}>
								{hu[0] !== playerSeat && (
									<PaymentModalInline
										game={game}
										playerSeat={playerSeat}
									/>
								)}
								<SentLogs logs={sentLogs} />
							</div>
						</div>
					</>
				)}
				{f[5] && (
					<>
						<StyledCenterText
							text={ScreenTextEng.DRAW_GAME}
							variant="h6"
							padding="3px"
						/>
						<StyledCenterText
							text={ScreenTextEng.FIFTEEN_LEFT}
							variant="subtitle1"
							padding="0px"
						/>
					</>
				)}
				{n[2] === 9 && (
					<StyledCenterText
						text={ScreenTextEng.GAME_ENDED}
						variant="subtitle1"
						padding="5px 0px 0px"
					/>
				)}
			</DialogContent>
			<DialogActions>
				<HomeButton callback={handleHome} />
				<StyledButton label={ButtonText.CHIPS} onClick={handleChips} />
				{hu[0] !== playerSeat &&
					(canHuFirst ? (
						<StyledButton label={ButtonText.HU} onClick={huFirst} />
					) : (
						id !== LocalFlag && (
							<StyledButton
								label={ButtonText.SHOW}
								onClick={handleShow}
								disabled={show}
							/>
						)
					))}
				{showNextRound && (
					<StyledButton label={ButtonText.NEXT_ROUND} onClick={nextRound} />
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
