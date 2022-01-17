import { ScrollableBase } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import React, { useCallback, useEffect } from 'react';

interface SentLogsProps {
	logs?: string[];
	align?: 'left' | 'right';
}

const SentLogs = ({ logs, align = 'left' }: SentLogsProps) => {
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
		<ScrollableBase id={sentLogsId} style={{ maxHeight: '60px', width: '90% !important' }}>
			{logs.map((log, index) => (
				<StyledText key={index} title={log} textAlign={align} variant="body2" />
			))}
		</ScrollableBase>
	);
};

export default SentLogs;
