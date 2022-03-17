import {
	BackgroundColor,
	Bot,
	BotIds,
	BotName,
	LocalFlag,
	Page,
	PaymentType,
	TableColor,
	TextColor,
	TileColor,
	Visitor
} from 'enums';
import { AppContext } from 'hooks';
import { User } from 'models';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ButtonText } from 'screenTexts';
import { ServiceInstance } from 'service';
import { setGameId, setLocalGame, setTheme, setTHK } from 'store/actions';
import { StyledButton } from 'style/StyledMui';

const PlayAIButton = () => {
	const { login, navigate } = useContext(AppContext);
	const dispatch = useDispatch();

	async function playVsAI() {
		const tempUser = new User(Visitor, Visitor, '');
		login(tempUser, false);

		const tempPlayers = [
			tempUser,
			new User(BotIds[0], BotName.bot1 || Bot, ''),
			new User(BotIds[1], BotName.bot2 || Bot, ''),
			new User(BotIds[2], BotName.bot3 || Bot, '')
		];

		await ServiceInstance.initGame(
			tempUser,
			tempPlayers,
			false,
			1,
			5,
			false,
			PaymentType.SHOOTER,
			[],
			false,
			true
		).then(game => {
			dispatch(setTHK(111));
			dispatch(setLocalGame(game));
			dispatch(setGameId(LocalFlag));
		});
		dispatch(
			setTheme({
				backgroundColor: BackgroundColor.BROWN,
				tableColor: TableColor.GREEN,
				tileColor: TileColor.DARK,
				mainTextColor: TextColor.DARK,
				tableTextColor: TextColor.LIGHT
			})
		);
		navigate(Page.TABLE);
	}

	return <StyledButton label={ButtonText.BOT_GAME} onClick={playVsAI} />;
};

export default PlayAIButton;
