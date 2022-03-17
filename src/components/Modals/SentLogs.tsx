import { ScrollableBase } from 'style/StyledComponents';
import { StyledCenterText } from 'style/StyledMui';
import { useCallback, useEffect } from 'react';

interface ISentLogsP {
	logs?: string[];
}

const SentLogs = ({ logs }: ISentLogsP) => {
	const sentLogsId = 'sent-logs';

	const scrollSentLogs = useCallback(() => {
		const sentLogsModal = document.getElementById(sentLogsId);
		if (sentLogsModal) {
			sentLogsModal.scrollTop = sentLogsModal.scrollHeight;
		}
	}, [sentLogsId]);

	useEffect(() => scrollSentLogs(), [scrollSentLogs, logs.length]);

	return (
		<ScrollableBase id={sentLogsId} style={{ maxHeight: '60px' }}>
			{logs.map((log, ix) => (
				<StyledCenterText key={ix} text={log} style={{ height: '20px', overflow: 'hidden' }} />
			))}
		</ScrollableBase>
	);
};

export default SentLogs;
