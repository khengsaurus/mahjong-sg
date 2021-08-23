import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import '../../App.scss';
import spinner from '../../images/brown-loading-spinner.svg';

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
					backgroundColor: 'rgb(215, 195, 170)'
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
