import { Loader } from 'platform/components/Loader';
import { useLocalSession } from 'platform/hooks';
import useLocalStorage from 'platform/hooks/useLocalStorage';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Row } from 'platform/style/StyledComponents';
import { StyledButton } from 'platform/style/StyledMui';
import { useState } from 'react';
import { Page, Size, Status, Suit } from 'shared/enums';
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

function getRandomWanTile(): IShownTile {
	let num = Math.floor(Math.random() * 9);
	return getSuitedTileMock(Suit.WAN, num, num);
}

const Sample = () => {
	const { execute, status, value, error } = useAsync(asynFn, false);
	const [wanTile, setWanTile] = useLocalStorage<IShownTile>('randomWanTile', null);
	const [size, setSize] = useLocalStorage<Size>('testSize', Size.MEDIUM);
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
			{wanTile && <img className={`tile`} src={getTileSrc(wanTile.c)} alt="tile" />}
			<br />
			<br />
		</div>
	);

	const testSizes = (
		<div className="container">
			<Row>
				<button className="button" onClick={() => setSize(Size.SMALL)}>{`Small`}</button>
				<button className="button" onClick={() => setSize(Size.MEDIUM)}>{`Medium`}</button>
				<button className="button" onClick={() => setSize(Size.LARGE)}>{`Large`}</button>
			</Row>
			<br />
			<div className={`dynamic-${size}`}>{size}</div>
			<br />
		</div>
	);

	function handleDelayClick() {
		setDelayFrom(new Date());
	}
	const testDelay = (
		<div className="container">
			<button className="button" onClick={handleDelayClick}>{`Start delay`}</button>
			{delayOn && <div className={`dynamic-large`}>{delayLeft}</div>}
		</div>
	);

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
						<StyledButton label={'Home'} navigate={Page.INDEX} />
					</>
				)}
			</Main>
		</HomeTheme>
	);
};

export default Sample;
