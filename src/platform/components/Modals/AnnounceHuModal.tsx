import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { isEmpty } from 'lodash';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles } from 'platform/style/MuiStyles';
import { Centered } from 'platform/style/StyledComponents';
import { HomeButton, StyledButton, Title } from 'platform/style/StyledMui';
import { useMemo } from 'react';
import { IAnnounceHuModalProps } from 'shared/typesPlus';
import { findRight, getHandDesc, isBefore } from 'shared/util';
import PaymentModalInline from './PaymentModalInline';

const AnnounceHuModal = ({ game, playerSeat, show, onClose: handleShow, HH, huFirst }: IAnnounceHuModalProps) => {
	const { hu = [], tBy = 0, draw = false, on = true, dealer = 0 } = game || {};

	const canHuFirst = useMemo((): boolean => {
		const whoHu = Number(hu[0]);
		return playerSeat !== whoHu && isBefore(playerSeat, whoHu, tBy) && !!HH?.maxPx;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSeat, hu[0] || 0, game?.mHu, HH?.maxPx]);

	async function nextRound() {
		game.ps.forEach(p => {
			p.sT = false;
			p.cfH = false;
		});
		FBService.updateGame(game);
		game.prepForNewRound();
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<Dialog
			open={!isEmpty(hu) || draw}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.small_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: 0 }}>
				{hu.length >= 3 ? (
					<>
						<Title
							title={`${game.ps[hu[0]]?.uN} hu, ${hu[1]}台${hu[2] === 1 ? ` 自摸` : ``}`}
							variant="h6"
							padding="3px 0px"
						/>
						{hu.slice(3, hu.length).map((p: string, ix: number) => {
							return <Title title={getHandDesc(p)} variant="subtitle2" padding="2px" key={ix} />;
						})}
						{hu[0] !== playerSeat && <PaymentModalInline game={game} playerSeat={playerSeat} />}
					</>
				) : (
					<Centered>
						{draw && <Title title={`Draw!`} variant="h6" />}
						{(!on || dealer === 10) && <Title title={`The game has ended!`} variant="h6" />}
					</Centered>
				)}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '0px 15px'
				}}
			>
				<HomeButton />
				{hu.length >= 3 &&
					hu[0] !== playerSeat &&
					(canHuFirst ? (
						<StyledButton label={'Hu'} onClick={huFirst} />
					) : (
						<StyledButton label={show ? 'Hide' : 'Show'} onClick={handleShow} />
					))}
				{(!on || dealer !== 10) &&
					playerSeat === (game.fN ? findRight(Number(game.dealer)) : Number(game.dealer)) && (
						<StyledButton label={`Next Round`} onClick={nextRound} />
					)}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
