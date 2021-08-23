import TextField from '@material-ui/core/TextField';
import { FieldProps } from 'formik';
import * as React from 'react';

// FieldProps handles field, form, input.value, input.onChange, input.onBlur
// field handles text input changes, mapped from name (?)
interface Props extends FieldProps {
	isRequired: boolean;
	label: string;
	type: string;
	errorMsg: string;
}

export const FormField: React.FC<Props> = ({ field, label, type = 'string', errorMsg = '', isRequired }) => {
	return (
		<TextField
			required={isRequired}
			type={type}
			label={label}
			error={errorMsg !== ''}
			helperText={errorMsg}
			{...field}
		/>
	);
};
