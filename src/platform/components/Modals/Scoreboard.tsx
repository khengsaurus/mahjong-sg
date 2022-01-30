import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { MuiStyles } from 'platform/style/MuiStyles';
import { StyledButton, StyledCenterText } from 'platform/style/StyledMui';
import React from 'react';
import { useSelector } from 'react-redux';
import { LocalFlag } from 'shared/enums';
import { User } from 'shared/models';
import { ButtonText, ScreenTextEng } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { stageToWindName } from 'shared/util';

interface IScoreboardProps {
	show: boolean;
	handleHome?: () => void;
	onClose?: () => void;
}

const Scoreboard = ({ show, handleHome, onClose }: IScoreboardProps) => {
	const { game, gameId, localGame } = useSelector((store: IStore) => store);
	const { ps = [], n = [] } = gameId === LocalFlag ? localGame : game || {};

	function renderChips() {
		return ps.map((p: User, ix: number) => <StyledCenterText key={ix} text={`${p.uN}: ${p.bal} chips`} />);
	}

	return (
		<Dialog
			open={show}
			onClose={onClose}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.small_dialog
				}
			}}
		>
			<DialogContent style={{ padding: '10px 15px 0px' }}>
				<StyledCenterText
					text={`${ScreenTextEng.NEW_ROUND}: ${stageToWindName(n[0])}`}
					variant="subtitle1"
					padding="3px 0px"
				/>
				{renderChips()}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					padding: '0px 8px',
					minHeight: '14px'
				}}
			>
				<HomeButton callback={handleHome} />
				<StyledButton label={ButtonText.LETS_GO} onClick={onClose} />
			</DialogActions>
		</Dialog>
	);
};

export default Scoreboard;
