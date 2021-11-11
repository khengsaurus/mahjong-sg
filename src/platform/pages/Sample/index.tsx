import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import useLocalStorage from 'platform/hooks/useLocalStorage';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useEffect, useState } from 'react';
import { isChiHand, useHand } from 'shared/AI/handLogic';
import { Pages, Sizes, Status, Suits, Winds } from 'shared/enums';
import { useAsync, useCountdown } from 'shared/hooks';
import getTileSrc from 'shared/images';
import { getSuitedTileMock } from 'shared/util';
import './sample.scss';

const asynFn = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const rnd = Math.random() * 10;
			rnd <= 5 ? resolve('Success 🙌') : reject('Error 😞');
		}, 1000);
	});
};

const wans = ['1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万'];

function getRandomWanTile(): IShownTile {
	let num = Math.floor(Math.random() * 9);
	let card = wans[num];
	return {
		card,
		suit: Suits.WAN,
		num: num + 1,
		id: `${card}1`,
		ix: 1,
		v: false
	};
}

const Sample = () => {
	const { execute, status, value, error } = useAsync(asynFn, false);
	const [wanTile, setWanTile] = useLocalStorage<IShownTile>('randomWanTile', null);
	const [size, setSize] = useLocalStorage<Sizes>('testSize', Sizes.MEDIUM);
	const [dFr, setDelayFrom] = useState<Date>(null);
	const { delayOn, delayLeft } = useCountdown(dFr, 6);
	const { verifyingSession } = useLocalSession();
	const showHooks = false;
	const showSizes = false;
	const showDelay = true;

	const testHooks = (
		<div className="container">
			<button className="button" onClick={() => execute()}>{`Call Fn`}</button>
			<br />
			<div className={status}>{status === Status.PENDING ? <Loader /> : value || error || ''}</div>
			<br />
			<br />
			<button className="button" onClick={() => setWanTile(getRandomWanTile())}>{`几万？`}</button>
			<br />
			{wanTile && <img className={`tile`} src={getTileSrc(wanTile.card)} alt="tile" />}
			<br />
			<br />
		</div>
	);

	const testSizes = (
		<div className="container">
			<Row>
				<button className="button" onClick={() => setSize(Sizes.SMALL)}>{`Small`}</button>
				<button className="button" onClick={() => setSize(Sizes.MEDIUM)}>{`Medium`}</button>
				<button className="button" onClick={() => setSize(Sizes.LARGE)}>{`Large`}</button>
			</Row>
			<br />
			<div className={`dynamic-${size}`}>{size}</div>
			<br />
		</div>
	);

	function handleDelayClick() {
		console.log('Starting delay');
		setDelayFrom(new Date());
	}
	const testDelay = (
		<div className="container">
			<button className="button" onClick={handleDelayClick}>{`Start delay`}</button>
			{delayOn && <div className={`dynamic-large`}>{delayLeft}</div>}
		</div>
	);

	const { validHands } = useHand(
		[1, 1, 2, 2, 2, 3, 3, 3, 4, 4].map((i, index) => {
			return getSuitedTileMock(Suits.WAN, i, index);
		}),
		getSuitedTileMock(Suits.WAN, 1, 1)
	);

	useEffect(() => {
		// console.log('all hands');
		// console.log(allHands);
		// console.log('hands with pair: ');
		// console.log(allHandsWithPair);
		// console.log('hands with meld: ');
		// console.log(allHandsWithMeld);
		// console.log('hands with meld and pair: ');
		// console.log(allHandsWithMeldAndPair);
		console.log('Valid hands:');
		console.log(validHands);
		console.log('isChiHand: ' + isChiHand(validHands[0], false, Winds.S, Winds.S));
		console.log('isChiHand: ' + isChiHand(validHands[2], false, Winds.S, Winds.S));
		// console.log('isSuited: ' + isSuited(validHands[0]));
	}, []);

	return (
		<HomeTheme>
			<Main>
				{verifyingSession === Status.PENDING ? (
					<Loader />
				) : (
					<>
						{showHooks && testHooks}
						{showSizes && testSizes}
						{showDelay && testDelay}
						<StyledButton label={'Home'} navigate={Pages.INDEX} />
					</>
				)}
			</Main>
		</HomeTheme>
	);
};

export default Sample;
