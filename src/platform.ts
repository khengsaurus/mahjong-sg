import { AppFlag } from 'enums';

export const isDev = process.env.REACT_APP_FLAG?.startsWith(AppFlag.DEV);