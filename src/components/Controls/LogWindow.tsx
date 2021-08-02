import { Dialog, DialogContent, IconButton, ThemeProvider, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { rotatedMUIDialog } from '../../util/utilFns';
import './Controls.scss';

interface Props {
	logs: string[];
	onClose: () => void;
	show: boolean;
}

const LogWindow = (props: Props) => {
	const { logs, onClose, show } = props;

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
						<IconButton
							style={{ color: 'black', position: 'absolute', top: '5px', right: '5px' }}
							onClick={onClose}
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="subtitle1">{'Logs'}</Typography>
						<ul id="logs">
							{logs.length > 0 &&
								logs.map((log: string, index) => {
									return (
										<li
											key={index}
											className={
												log.includes('sent') ? 'pay' : log.includes('move') ? 'turn' : ''
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

export default LogWindow;
