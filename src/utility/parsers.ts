import jwt from 'jsonwebtoken';
import { PaymentType } from 'enums';
import { Game, User } from 'models';
import { IUserJwt } from 'typesPlus';
import { getDateTime } from 'utility';

export function userToObj(user: User) {
	return {
		id: user.id,
		uN: user.uN,
		email: user.email,
		_b: user._b,
		_s: user._s,
		_n: user._n,
		hSz: user.hSz,
		tSz: user.tSz,
		cSz: user.cSz,
		bgC: user.bgC,
		tC: user.tC,
		tBC: user.tBC,
		hp: user.hp
	};
}

/**
 * @param: IUserJwt | firebase.firestore.DocumentData | FirebaseFirestoreTypes
 */
export function objToUser(obj: jwt.JwtPayload): User;
export function objToUser(obj: IUserJwt): User;
export function objToUser(obj: any): User {
	let user: User = null;
	let ref: any = null;
	let id = '';
	try {
		if (obj.docs) {
			ref = obj.docs[0].data();
			id = obj.docs[0].id;
		} else {
			ref = obj as IUserJwt;
			id = ref.id;
		}
		const uData = {
			hSz: ref.hSz,
			tSz: ref.tSz,
			cSz: ref.cSz,
			bgC: ref.bgC,
			tC: ref.tC,
			tBC: ref.tBC,
			hp: ref.hp
		};
		user = new User(id, ref.uN, ref.email, ref._b, ref._s, ref._n, uData);
	} catch (err) {
		console.error(err.message + 'Failed to resolve user object');
	} finally {
		return user;
	}
}

export function jwtToObj(jwtObj: any, key: string) {
	const userObj = jwt.verify(jwtObj, key);
	return objToUser(userObj as jwt.JwtPayload);
}

export function objToJwt(obj: User, key: string) {
	return jwt.sign(userToObj(obj), key, {
		algorithm: 'HS256'
	});
}

export function objToPlayer(data: any): User {
	const pData = {
		ms: data.ms,
		hTs: data.hTs,
		sTs: data.sTs,
		dTs: data.dTs,
		lTa: data.lTa,
		uTs: data.uTs,
		bal: Number(data.bal) || 0,
		sT: data.sT,
		cfH: data.cfH
	};
	return new User(data.id, data.uN, data.email, [], [], [], pData);
}

export function playerToObj(user: User) {
	return {
		id: user.id,
		uN: user.uN,
		hTs: user.hTs || [],
		sTs: user.sTs || [],
		ms: user.ms || [],
		dTs: user.dTs || [],
		lTa: user.lTa || {},
		uTs: user.uTs || 0,
		bal: Number(user.bal) || 0,
		sT: user.sT || false,
		cfH: user.cfH || false
	};
}

/**
 * @param: firebase.firestore.DocumentData | FirebaseFirestoreTypes
 */
export function objToGame(doc: any, repr = false): Game {
	if (!doc) {
		return null;
	}
	try {
		let ref: any = doc.data ? doc.data() : doc;
		const dates = ref.t.map(_t => getDateTime(_t, true));
		return repr
			? new Game(doc.id, ref.cO, ref.pS, ref.es, dates)
			: new Game(
					doc.id,
					ref.cO,
					ref.pS,
					ref.es,
					dates,
					ref.f?.map(_f => Boolean(_f)),
					ref.n?.map(_n => Number(_n)),
					ref.ps.map((player: any) => objToPlayer(player)),
					ref.ts,
					ref.lTh,
					ref.hu,
					ref.logs,
					ref.sk,
					ref.prE,
					ref.sHs,
					ref.pay
			  );
	} catch (err) {
		console.error(err);
		return null;
	}
}

export function gameToObj(game: Game) {
	return {
		id: game.id || '',
		cO: game.cO || '',
		pS: game.pS || '',
		es: game.es || [],
		t: game.t || [],
		f: game.f || [],
		n: game.n || [],
		ps: game.ps?.map(player => playerToObj(player)) || [],
		ts: game.ts,
		lTh: game.lTh || {},
		hu: game.hu || [],
		logs: game.logs || [],
		sk: game.sk || [],
		prE: game.prE || {},
		sHs: game.sHs || [],
		pay: game.pay || PaymentType.SHOOTER
	};
}
