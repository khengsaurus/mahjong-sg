import ServiceInstance from 'platform/service/ServiceLayer';
import { StyledButton } from 'platform/style/StyledMui';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
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
} from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { ButtonText } from 'shared/screenTexts';
import { setGameId, setLocalGame, setTheme, setTHK } from 'shared/store/actions';

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
