import React, { useContext, useEffect } from 'react';
import { Pages } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import { AppContext } from '../../util/hooks/AppContext';
import './sample.scss';

const Sample = () => {
	const { user, handleUserState, tableColor, backgroundColor, tableTextColor } = useContext(AppContext);

	useEffect(() => {
		if (!user) {
			handleUserState();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const arr = [1, 2, 3, 4, 5, 6, 7, 8];
	return (
		<HomeTheme>
			<Main>
				<Title title={'Sample'} />
				<div className="container">
					<div className="col" style={{ backgroundColor: tableColor }}>
						{arr.map(i => {
							return (
								<div
									className="cell"
									style={{ backgroundColor: backgroundColor, color: tableTextColor }}
									key={i}
								>
									{i}
								</div>
							);
						})}
					</div>
					<br />
					<div className="col" style={{ backgroundColor: tableColor }}>
						{arr.map(i => {
							return (
								<div
									className="cell"
									style={{ backgroundColor: backgroundColor, color: tableTextColor }}
									key={`${i}-2`}
								>
									{i}
								</div>
							);
						})}
					</div>
					<br />
					{/* <div className="row" style={{ backgroundColor: tableColor }}>
						{arr.map(i => {
							return (
								<div
									className="cell"
									style={{ backgroundColor: backgroundColor, color: tableTextColor }}
									key={i}
								>
									{i}
								</div>
							);
						})}
					</div> */}
				</div>
				<StyledButton label={'Home'} navigate={Pages.index} />
			</Main>
		</HomeTheme>
	);
};

export default Sample;
