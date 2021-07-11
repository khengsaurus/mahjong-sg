import { Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import HomeButton from '../../components/HomeButton';
import { AppContext } from '../../util/hooks/AppContext';

const Table = () => {
	const { user, game } = useContext(AppContext);
	let table = (
		<div className="main">
			{game && <Typography variant="h6">{`Game ${game.id}, stage ${game.stage}`}</Typography>}
			<br></br>
			<HomeButton />
		</div>
	);
	let noActiveGame = (
		<div className="main">
			<Typography variant="h6">No ongoing game</Typography>
			<br></br>
			<HomeButton />
		</div>
	);
	return user && game ? table : noActiveGame;
};

export default Table;
