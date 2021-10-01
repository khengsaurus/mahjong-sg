import React from 'react';
import { Loader } from '../../components/Loader';
import { Pages, Sizes, Status } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main, Row } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import getTileSrc from '../../images';
import { useAsync, useLocalStorage } from '../../util/hooks/useHooks';
import useSession from '../../util/hooks/useSession';
import './sample.scss';

const myFunction = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const rnd = Math.random() * 10;
			rnd <= 5 ? resolve('Success 🙌') : reject('Error 😞');
		}, 1000);
	});
};

const wans = ['1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万'];

function getRandomWanTile(): ITile {
	let number = Math.floor(Math.random() * 9);
	let card = wans[number];
	return {
		card,
		suit: '万',
		number,
		id: `${card}1`,
		uuid: '123',
		index: 1,
		show: false,
		isValidFlower: false
	};
}

const Sample = () => {
	const { execute, status, value, error } = useAsync(myFunction, false);
	const [wanTile, setWanTile] = useLocalStorage<ITile>('randomWanTile', null);
	const [size, setSize] = useLocalStorage<Sizes>('testSize', Sizes.MEDIUM);
	const { verifyingSession } = useSession();
	const hideHooks = true;

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

	return (
		<HomeTheme>
			<Main>
				<Title title={verifyingSession === Status.SUCCESS ? 'Logged in' : 'Not logged in'} />
				{verifyingSession === Status.PENDING ? (
					<Loader />
				) : (
					<>
						{!hideHooks && testHooks}
						{testSizes}
						<StyledButton label={'Home'} navigate={Pages.INDEX} />
					</>
				)}
			</Main>
		</HomeTheme>
	);
};

export default Sample;
