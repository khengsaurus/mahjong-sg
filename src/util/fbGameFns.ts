import firebase from 'firebase';
import { Game } from '../components/Models/Game';
import { User } from '../components/Models/User';
import * as firebaseService from '../service/firebaseService';
import { typeCheckTile, typeCheckUser } from './utilFns';

export const setUserGame = async (user: User, game?: Game, gameId?: string) => {
	firebaseService.getGameById(game, gameId).then(gameData => {
		// console.log(gameData.id);
		// console.log(gameData.data());
		//
		// Send invites to players? Tag players active game as ^ id ?
		// Set seats
		// Logic for playing
	});
};
