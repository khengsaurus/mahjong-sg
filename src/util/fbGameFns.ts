import { Game } from '../components/Models/Game';
import { User } from '../components/Models/User';
import * as firebaseService from '../service/firebaseService';
import { objsToUsers } from './utilFns';

export const setUserGame = async (user: User, game?: Game, gameId?: string) => {
	firebaseService.getGameById(game, gameId).then(gameData => {
		console.log(gameData.id);
		console.log(gameData.data());
		let players = objsToUsers(gameData.data().players);
		players.forEach(player => {
			console.log(player.username);
		});
		// TODO: TODO: TODO: TODO:
		// Send invites to players? Tag players active game as ^ id ?
		// Set seats
		// Logic for playing
	});
};
