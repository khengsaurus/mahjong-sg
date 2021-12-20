import { StyledButton } from 'platform/style/StyledMui';
import sample_user3_hu from 'shared/__mock__/sample_user3_hu.json';
import sample_multi_hu from 'shared/__mock__/sample_multi_hu.json';
import sample_user2_pong_then_kang from 'shared/__mock__/sample_user2_pong_then_kang.json';
import sample_user1_close_hu from 'shared/__mock__/sample_user1_close_hu.json';

interface IDevControls {
	set: (obj?: any) => void;
}

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions: IGameStateOption[] = [
		{ label: 'User3 Hu', obj: sample_user3_hu },
		{ label: 'Multi Hu', obj: sample_multi_hu },
		{ label: 'User2 pong/kang', obj: sample_user2_pong_then_kang },
		{ label: 'User1 close to hu', obj: sample_user1_close_hu }
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
