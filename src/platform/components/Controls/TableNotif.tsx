import Fade from '@material-ui/core/Fade';
import { Notification, TableText } from 'platform/style/StyledComponents';
import { useContext } from 'react';
import { Timeout } from 'shared/enums';
import { AppContext } from 'shared/hooks';

interface ITableNotif {
	notif: string;
}

const TableNotif = ({ notif }: ITableNotif) => {
	const { mainTextColor } = useContext(AppContext);

	return (
		<Fade in timeout={Timeout.FAST}>
			<Notification className="notif">
				<TableText className="text" style={{ color: mainTextColor }}>
					{notif}
				</TableText>
			</Notification>
		</Fade>
	);
};

export default TableNotif;
