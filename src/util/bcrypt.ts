import bcrypt from 'bcryptjs';

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, function (err, hash) {
			if (err) {
				reject(new Error('Unable to hash input: ' + err.toString()));
			} else {
				resolve(hash);
			}
		});
	});
}

async function compare(password: string, hash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hash, function (err, result) {
			if (err) {
				reject(new Error('Unable to compare input and hashed password: ' + err.toString()));
			} else {
				resolve(result);
			}
		});
	});
}

export { hashPassword, compare };
