import { Checkbox } from '@mui/material';
import { FormRow } from 'style/StyledComponents';
import { StyledText } from 'style/StyledMui';

interface ICheckBoxP {
	title: string;
	value: boolean;
	onChange: () => void;
	titleVariant?: 'subtitle2' | 'h6' | 'subtitle1';
	titlePadding?: string;
	defaultChecked?: boolean;
}

const CheckBox = ({
	title,
	value,
	onChange,
	titleVariant = 'subtitle2',
	titlePadding = '0px',
	defaultChecked = false
}: ICheckBoxP) => {
	return (
		<FormRow>
			<StyledText text={title} variant={titleVariant} padding={titlePadding} />
			<Checkbox value={value} onChange={onChange} defaultChecked={defaultChecked} />
		</FormRow>
	);
};

export default CheckBox;
