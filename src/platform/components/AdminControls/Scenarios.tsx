import { StyledButton } from 'platform/style/StyledMui';
import sample_user2canKang from 'platform/__tests__/sample_user2canKang.json';
import sample_user2canPongKang from 'platform/__tests__/sample_user2canPongKang.json';

interface IDevControls {
	set: (obj?: any) => void;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions = [
		{ label: 'user2 to kang', obj: sample_user2canKang },
		{ label: 'user2 to kang/pong', obj: sample_user2canPongKang }
	];

	return (
		<>
			{gameStateOptions.map((o, ix) => {
				return <StyledButton key={ix} label={o.label} onClick={() => set(o.obj)} />;
			})}
		</>
	);
};

export default Scenarios;
