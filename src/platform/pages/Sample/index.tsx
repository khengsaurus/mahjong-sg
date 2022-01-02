import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main } from 'platform/style/StyledComponents';
import { StyledButton, StyledText } from 'platform/style/StyledMui';
import { useState } from 'react';
import './sample.scss';

interface IObject {
	count?: number;
}

// See that the state obj is not re-created upon state change
const Sample = () => {
	const [obj, setObj] = useState<IObject>({ count: 0 });
	const [count2, setCount2] = useState(0);

	return (
		<HomeTheme>
			<Main>
				<StyledText title={`Count: ${obj.count}`} />
				<StyledText title={`Count2: ${count2}`} />
				<StyledButton
					label="Add"
					onClick={() => {
						setObj({ ...obj, count: obj.count + 1 });
					}}
				/>
				<StyledButton
					label="Add2"
					onClick={() => {
						setCount2(count2 + 1);
					}}
				/>
				<HomeButton />
			</Main>
		</HomeTheme>
	);
};

export default Sample;
