import { useContext, useState } from 'react';
import { Loader } from '../../components/Loader';
import SettingsWindow from '../../components/SettingsWindow/SettingsWindow';
import { Pages, Status } from '../../global/enums';
import { HomeTheme } from '../../global/MuiStyles';
import { Main } from '../../global/StyledComponents';
import { StyledButton, Title } from '../../global/StyledMui';
import { AppContext } from '../../util/hooks/AppContext';
import useSession from '../../util/hooks/useSession';
import './home.scss';

const Home = () => {
	const { verifyingSession } = useSession();
	const { user, logout } = useContext(AppContext);
	const [showSettings, setShowSettings] = useState(false);

	let markup = (
		<>
			<Title title={`Welcome ${user?.username}`} />
			<StyledButton label={'New Game'} navigate={Pages.NEWGAME} />
			<StyledButton label={'Join Game'} navigate={Pages.JOINGAME} />
			<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
			{/* <StyledButton label={'Sample'} navigate={Pages.SAMPLE} /> */}
			<StyledButton label={'Logout'} onClick={logout} />
			{showSettings && (
				<SettingsWindow
					show={showSettings}
					onClose={() => {
						setShowSettings(false);
					}}
				/>
			)}
		</>
	);

	return (
		<HomeTheme>
			<Main>{verifyingSession === Status.PENDING ? <Loader /> : markup}</Main>
		</HomeTheme>
	);
};

export default Home;
