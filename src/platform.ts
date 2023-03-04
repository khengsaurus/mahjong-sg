import { AppFlag } from 'enums';

export const isDev = process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV);

export const isDevBot = process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV_BOT);