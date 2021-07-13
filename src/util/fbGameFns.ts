import firebase from 'firebase';
import { Game } from '../components/Models/Game';
import { User } from '../components/Models/User';
import * as firebaseService from '../service/firebaseService';
import { objsToUsers, typeCheckTile } from './utilFns';

export const gameDataToGame = (doc: firebase.firestore.DocumentData | any): Game => {
	return new Game(
		doc.id,
		doc.data().players,
		doc.data().playerIds,
		doc.data().playersString,
		doc.data().stage,
		doc.data().ongoing,
		doc.data().tiles.map((tile: any) => {
			return typeCheckTile(tile);
		}),
		doc.data().whoseMove,
		doc.data().createdAt.toDate() || null
	);
};

export const setUserGame = async (user: User, game?: Game, gameId?: string) => {
	firebaseService.getGameById(game, gameId).then(gameData => {
		console.log(gameData.id);
		console.log(gameData.data());
		//
		// Send invites to players? Tag players active game as ^ id ?
		// Set seats
		// Logic for playing
	});
};
