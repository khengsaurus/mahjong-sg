import spinner from '../../images/brown-loading-spinner.svg';
import '../../App.scss';
import { Dialog, DialogContent } from '@material-ui/core';

interface LoaderProps {
	show: boolean;
}
const LoadingSpinner = (props: LoaderProps) => {
	const { show } = props;

	return (
		<Dialog
			open={show}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					backgroundColor: 'rgb(220, 190, 150)'
				}
			}}
		>
			<DialogContent>
				<img alt="loading-spinner" src={spinner} />
			</DialogContent>
		</Dialog>
	);
};

export default LoadingSpinner;
