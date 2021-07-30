import { Dialog, DialogContent, IconButton, ThemeProvider, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { Game } from '../../Models/Game';
import { rotatedMUIDialog } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	game: Game;
	onClose: () => void;
	show: boolean;
}

const Logs = (props: Props) => {
	const { game, onClose, show } = props;
	const logs = game.logs.length <= 20 ? game.logs : game.logs.slice(game.logs.length - 20, game.logs.length);

	return (
		<div className="main transparent">
			<ThemeProvider theme={rotatedMUIDialog}>
				<Dialog
					open={show}
					BackdropProps={{ invisible: true }}
					onClose={onClose}
					PaperProps={{
						style: {
							backgroundColor: 'rgb(220, 190, 150)'
						}
					}}
				>
					<DialogContent>
						<IconButton style={{ position: 'absolute', top: '12px', right: '15px' }} onClick={onClose}>
							<CloseIcon />
						</IconButton>
						<Typography variant="subtitle1">{'Logs'}</Typography>
						<ul id="logs-list">
							{logs &&
								logs.map((log: string, index) => {
									return (
										<li
											key={index}
											className={
												log.includes('paid') ? 'pay' : log.includes('move') ? 'turn' : ''
											}
										>
											{log}
										</li>
									);
								})}
						</ul>
					</DialogContent>
				</Dialog>
			</ThemeProvider>
		</div>
	);
};

export default Logs;
