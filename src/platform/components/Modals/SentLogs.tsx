import { ScrollableBase } from 'platform/style/StyledComponents';
import { StyledCenterText } from 'platform/style/StyledMui';
import React, { useCallback, useEffect } from 'react';

interface SentLogsProps {
	logs?: string[];
}

const SentLogs = ({ logs }: SentLogsProps) => {
	const sentLogsId = 'sent-logs';

	const scrollSentLogs = useCallback(() => {
		const sentLogsModal = document.getElementById(sentLogsId);
		if (sentLogsModal) {
			sentLogsModal.scrollTop = sentLogsModal.scrollHeight;
		}
	}, [sentLogsId]);

	useEffect(() => {
		scrollSentLogs();
	}, [scrollSentLogs, logs.length]);

	return (
		<ScrollableBase id={sentLogsId} style={{ maxHeight: '60px' }}>
			{logs.map((log, ix) => (
				<StyledCenterText key={ix} text={log} style={{ height: '20px', overflow: 'hidden' }} />
			))}
		</ScrollableBase>
	);
};

export default SentLogs;
