import { Dialog, DialogContent, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeScreenText } from 'screenTexts';
import AxiosService from 'service/AxiosService';
import { HomeTheme } from 'style/MuiStyles';
import { StyledButton } from 'style/StyledMui';
import './redirectNotice.scss';

const RedirectNotice = () => {
	const [promptRedirectTo, setPromptRedirectTo] = useState('');
	const location = useLocation();
	const closedRef = useRef(false);

	useEffect(() => {
		if (closedRef.current) return;

		const currHost = window.location.host;
		AxiosService.getWebsiteUrl().then(({ url, host }) => {
			if (!host || !url) return;
			if (!currHost.includes(host)) setPromptRedirectTo(url);
		});
	}, [location]);

	function handleClose() {
		closedRef.current = true;
		setPromptRedirectTo('');
	}

	return (
		<HomeTheme>
			<Dialog
				className="redirect-prompt-modal"
				open={Boolean(promptRedirectTo)}
				onClose={handleClose}
			>
				<Typography variant="h6">{HomeScreenText.REDIRECT_TITLE}</Typography>
				<DialogContent>
					<Typography>
						{HomeScreenText.REDIRECT_BODY}
						<br />
						<a href={promptRedirectTo} target="_blank" rel="noreferrer">
							{promptRedirectTo}
						</a>
					</Typography>
				</DialogContent>
				<StyledButton onClick={handleClose} label="Ok" />
			</Dialog>
		</HomeTheme>
	);
};

export default RedirectNotice;
