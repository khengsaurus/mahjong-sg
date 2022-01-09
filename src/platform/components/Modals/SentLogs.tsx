import { Scrollable } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
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
		<Scrollable id={sentLogsId} style={{ maxHeight: '60px' }}>
			{logs.map((log, index) => (
				<StyledText key={index} title={log} variant="body2" />
			))}
		</Scrollable>
	);
};

export default SentLogs;
