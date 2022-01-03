import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.tk.mahjongSg',
	appName: 'Mahjong SG',
	webDir: 'build',
	bundledWebRuntime: false,
	plugins: {
		Keyboard: {
			resize: 'body',
			style: 'dark',
			resizeOnFullScreen: true
		}
	}
};

export default config;
