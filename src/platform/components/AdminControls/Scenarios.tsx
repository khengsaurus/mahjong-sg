import { StyledButton } from 'platform/style/StyledMui';

interface IDevControls {
	set: (obj?: any) => void;
}

interface IGameStateOption {
	label: string;
	obj: Object;
}

const Scenarios = ({ set }: IDevControls) => {
	const gameStateOptions: IGameStateOption[] = [
		// { label: 'Multi user hu', obj: multi_user_hu },
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
