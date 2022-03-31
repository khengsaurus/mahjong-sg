export enum Notif {
	UPDATE = 'Please update Mahjong SG to the latest version for the best experience '
}

export enum InfoMessage {
	CONTENT_RETRIEVED = 'Content retrieved',
	FIREBASE_CONNECTED = 'Server connected 🍦',
	FIREBASE_DISCONNECTED = 'Server not connected',
	FIREBASE_INIT_ERROR = 'Firebase App failed to initialize 💧',
	FIREBASE_INIT_SUCCESS = 'Firebase App initialized 🔥',
	FIREBASE_USER_NO = 'No Firebase user 🥲',
	FIREBASE_USER_YES = 'Firebase user signed in 😊',
	REGISTER_SUCCESS = 'Registered successfully',
	SERVER_INIT = 'Initializing service instance',
	SERVER_READY = 'Service instance ready'
}

export enum ErrorMessage {
	REQUIRES_RECENT_LOGIN = 'requires-recent-login',
	AUTH_DELETE_ERROR = 'ServiceLayer: user docs deleted, auth deletion failed -> restoring user',
	CONTENT_FETCH_FAIL = 'Failed to fetch content',
	FIREBASE_WRONG_PW = 'WRONG-PASSWORD',
	ACC_DELETE_TIMEOUT = 'Account deletion request timeout',
	TRANSACTION_UPDATE_FAILED = 'Transaction update failed',
	SERVICE_OFFLINE = 'Service is not connected',

	// User display msgs
	DELETE_ERROR = 'Failed to delete account. Please try again later',
	EMAIL_USED = 'Email is already used',
	INIT_ONLINE_GAME = 'ServiceLayer failed to create an online game',
	INIT_LOCAL_GAME = 'ServiceLayer failed to create a local game',
	INVALID_EMAIL = 'Invalid email format',
	LOGIN_ERROR = 'Incorrect username or password',
	NO_USER_BY_USERNAME = 'Could not find a user with that username',
	PW_NOT_MATCHING = 'Passwords do not match',
	REGISTER_ERROR = 'Unable to register',
	REGISTER_ISSUE = `Please close the app, then open it and try logging in again. If this keeps happening, there may have been an issue during registration with an earlier version of the app. Please get in touch with us :/`,
	TRY_AGAIN = 'Please try again',
	UNABLE_TO_CONNECT = 'Unable to connect to the server',
	USERNAME_NOT_ALLOWED = 'Usernames cannot start with ',
	USERNAME_TAKEN = 'Username already taken'
}
