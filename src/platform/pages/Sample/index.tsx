import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import useLocalStorage from 'platform/hooks/useLocalStorage';
import { _2ChiMix1PairMix_2, _nothing12Tiles } from 'platform/pages/Sample/sampleHands';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useMemo, useState } from 'react';
import { getHands, handsWithMeld, handsWithMeldWithPair, handsWithPair } from 'shared/AI/handLogic';
import { Pages, Sizes, Status, Suits } from 'shared/enums';
import { useAsync, useCountdown } from 'shared/hooks';
import getTileSrc from 'shared/images';
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

	const extraCard = { card: '9万', num: 9, suit: '万' };
	useMemo(() => {
		console.log(getHands([..._2ChiMix1PairMix_2, extraCard]));
		console.log(handsWithMeld([..._2ChiMix1PairMix_2, extraCard]));
		console.log(handsWithPair([..._2ChiMix1PairMix_2, extraCard]));
		console.log(handsWithMeldWithPair([..._2ChiMix1PairMix_2, extraCard]));
		console.log('12');
		console.log(getHands(_nothing12Tiles));
		console.log(handsWithMeld(_nothing12Tiles));
		console.log(handsWithPair(_nothing12Tiles));
		console.log(handsWithMeldWithPair(_nothing12Tiles));
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
