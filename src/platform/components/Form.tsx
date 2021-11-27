import Checkbox from '@material-ui/core/Checkbox';
import { FormRow } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';

interface CheckBoxProps {
	title: string;
	onChange: () => void;
	titleVariant?: 'subtitle2' | 'h6' | 'subtitle1';
	titlePadding?: string;
	defaultChecked?: boolean;
	expanded?: boolean;
}

const CheckBox = ({
	title,
	onChange,
	titleVariant = 'subtitle2',
	titlePadding = '0px',
	defaultChecked = false,
	expanded = false
}: CheckBoxProps) => {
	return (
		<FormRow>
			<Title title={title} variant={titleVariant} padding={titlePadding} style={{ left: expanded ? 0 : null }} />
			<Checkbox defaultChecked={defaultChecked} onChange={onChange} style={{ right: expanded ? 0 : null }} />
		</FormRow>
	);
};

export default CheckBox;
