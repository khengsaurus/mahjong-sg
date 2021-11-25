import { StyledButton } from 'platform/style/StyledMui';
import sample_user2canKang from 'platform/__tests__/sample_user2_canKang.json';
import sample_user2canPongKang from 'platform/__tests__/sample_user2_canPongKang.json';
import sample_user3user4canHu from 'platform/__tests__/sample_user3_user4_canHu.json';

interface IDevControls {
	set: (obj?: any) => void;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions = [
		{ label: 'user2 to kang', obj: sample_user2canKang },
		{ label: 'user2 to kang/pong', obj: sample_user2canPongKang },
		{ label: 'user3/user4 to hu', obj: sample_user3user4canHu }
	];

	return (
		<>
			{gameStateOptions.map((o, ix) => (
				<StyledButton key={ix} label={o.label} onClick={() => set(o.obj)} />
			))}
		</>
	);
};

export default Scenarios;
