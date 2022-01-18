import { ScrollableBase } from 'platform/style/StyledComponents';
import { StyledCenterText } from 'platform/style/StyledMui';
import React, { useCallback, useEffect } from 'react';

interface SentLogsProps {
	logs?: string[];
	align?: 'left' | 'center' | 'right';
}

const SentLogs = ({ logs, align = 'center' }: SentLogsProps) => {
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
		<ScrollableBase id={sentLogsId} style={{ maxHeight: '60px', marginTop: 5 }}>
			{logs.map((log, index) => (
				<StyledCenterText key={index} title={log} />
			))}
		</ScrollableBase>
	);
};

export default SentLogs;
