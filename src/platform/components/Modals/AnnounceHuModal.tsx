import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { isEmpty } from 'lodash';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import PaymentModalInline from 'platform/components/Modals/PaymentModalInline';
import { MuiStyles } from 'platform/style/MuiStyles';
import { StyledButton, StyledCenterText } from 'platform/style/StyledMui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PaymentType } from 'shared/enums';
import { ButtonText, PaymentLabel } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { AnnounceHuModalProps } from 'shared/typesPlus';
import { getHandDesc, isBefore } from 'shared/util';
import './announceHuModal.scss';
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
	const { user } = useSelector((store: IStore) => store);
	const { hu = [], thB = 0, f = [], _d = 0, pay, ps, logs, lTh } = game || {};
	const whoHu = Number(hu[0]);

	const canHuFirst = useMemo((): boolean => {
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, thB) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, whoHu, f[6], HH?.maxPx]);

	const sentLogs = useMemo(() => {
		const huLogIndex = logs?.findIndex(l => l.includes('hu with'));
		const sent = logs?.slice(huLogIndex)?.filter(log => log.includes('sent')) || [];
		return sent.map(log => {
			return log.replace(`${ps[whoHu].uN} `, '').replace(user?.uN, log.startsWith(user?.uN) ? 'You' : 'you');
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logs?.length]);

	const hasHandDescs = hu.length > 3;
	const hasRightPanel = whoHu !== playerSeat || sentLogs.length > 0;

	function renderHandDesc() {
		return (
			hu
				.slice(3, hu.length)
				// ['Four Greater Blessings', 'Lots of stuff', '3 Flower Tiles']
				.map((p: string, ix: number) => (
					<StyledCenterText
						key={ix}
						// title={p}
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
		return Number(hu[2]) === 0 && thB !== Number(hu[0]) && !isEmpty(lTh)
			? `Last tile thrown by ${thB === playerSeat ? 'you' : ps[thB]?.uN}.`
			: Number(hu[2] === 1)
			? `Last tile self drawn.`
			: ``;
	}

	return (
		<Dialog
			open={!isEmpty(hu) || f[5]}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.medium_dialog
				}
			}}
		>
			<DialogContent style={{ padding: '10px 15px 0 15px' }}>
				{hu.length > 2 && (
					<>
						<StyledCenterText
							text={`${hu[0] === playerSeat ? 'You' : ps[hu[0]]?.uN} Hu with ${hu[1]}台`}
							style={{ paddingBottom: '0px' }}
							variant="body1"
						/>
						<StyledCenterText text={`${getPaymentText()} ${getLastThrownText()}`} />
						<div className="ann-panels">
							{hasHandDescs && (
								<div className={hasRightPanel ? 'left-panel' : 'full-panel'}>{renderHandDesc()}</div>
							)}
							<div className={hasHandDescs ? `right-panel` : `full-panel`}>
								{hu[0] !== playerSeat && <PaymentModalInline game={game} playerSeat={playerSeat} />}
								<SentLogs logs={sentLogs} />
							</div>
						</div>
					</>
				)}
				{(!f[0] || f[5] || _d === 9) &&
					(f[5] ? (
						<>
							<StyledCenterText text={`Draw!`} variant="h6" padding="6px" />
							<StyledCenterText text={`15 tiles left`} variant="subtitle1" padding="0px" />
						</>
					) : (
						<StyledCenterText text={`The game has ended!`} variant="subtitle1" padding="6px 0px" />
					))}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '0px 6px',
					marginTop: '-4px'
				}}
			>
				<HomeButton style={{ padding: '10px' }} />
				{hu[0] !== playerSeat &&
					(canHuFirst ? (
						<StyledButton label={ButtonText.HU} onClick={huFirst} padding="10px" />
					) : (
						!show && <StyledButton label={ButtonText.SHOW} onClick={handleShow} padding="10px" />
					))}
				{showNextRound && <StyledButton label={ButtonText.NEXT_ROUND} onClick={nextRound} padding="10px" />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
