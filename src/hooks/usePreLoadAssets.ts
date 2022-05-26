import {
	cat,
	db,
	df,
	dh,
	flowerJ,
	flowerL,
	flowerM,
	flowerZ,
	mouse,
	na,
	rooster,
	seasonChun,
	seasonDong,
	seasonQiu,
	seasonXia,
	we,
	wn,
	worm,
	ws,
	ww,
	_1S,
	_1T,
	_1W,
	_2S,
	_2T,
	_2W,
	_3S,
	_3T,
	_3W,
	_4S,
	_4T,
	_4W,
	_5S,
	_5T,
	_5W,
	_6S,
	_6T,
	_6W,
	_7S,
	_7T,
	_7W,
	_8S,
	_8T,
	_8W,
	_9S,
	_9T,
	_9W
} from 'images';
import { isDev, isMobile } from 'platform';
import { useEffect } from 'react';

const tiles1 = [db, df, dh, we, wn, ws, ww];

const tiles2 = [
	_1S,
	_1T,
	_1W,
	_2S,
	_2T,
	_2W,
	_3S,
	_3T,
	_3W,
	_4S,
	_4T,
	_4W,
	_5S,
	_5T,
	_5W,
	_6S,
	_6T,
	_6W,
	_7S,
	_7T,
	_7W,
	_8S,
	_8T,
	_8W,
	_9S,
	_9T,
	_9W,
	cat,
	flowerJ,
	flowerL,
	flowerM,
	flowerZ,
	mouse,
	na,
	rooster,
	seasonChun,
	seasonDong,
	seasonQiu,
	seasonXia,
	worm
];

async function preload(tiles: string[]) {
	const imagesPromiseList: Promise<any>[] = [];
	for (const i of tiles) {
		imagesPromiseList.push(preloadImage(i));
	}
	await Promise.all(imagesPromiseList).catch(err =>
		console.info('Failed to preload tiles: ' + err.message)
	);
}

function preloadImage(src: string) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = img.onabort = () => reject(src);
		img.src = src;
	});
}

const usePreLoadAssets = (all = false) => {
	useEffect(() => {
		if (!isMobile) {
			preload(all ? tiles2 : tiles1).then(() => {
				isDev &&
					console.info(`Successfully preloaded${all ? ' all ' : ' '}tiles`);
			});
		}
	}, [all]);
};

export default usePreLoadAssets;
