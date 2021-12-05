import { StyledButton } from 'platform/style/StyledMui';
import multi_user_hu from 'shared/__tests__/sample_multi_users_hu.json';
import user3_pong_kang from 'shared/__tests__/sample_user3_can_pong_kang.json';

interface IDevControls {
	set: (obj?: any) => void;
}

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions: IGameStateOption[] = [
		{ label: 'Multi user hu', obj: multi_user_hu },
		{ label: 'user3 pong kang', obj: user3_pong_kang }
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
