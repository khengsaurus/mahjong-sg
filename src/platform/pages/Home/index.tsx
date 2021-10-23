import { Loader } from 'platform/components/Loader';
import SettingsWindow from 'platform/components/SettingsWindow/SettingsWindow';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, PlatformSpecs } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useContext, useState } from 'react';
import { Pages, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks/AppContext';
import useSession from 'shared/hooks/useSession';
import './home.scss';

const Home = () => {
	const { verifyingSession } = useSession();
	const { user, logout } = useContext(AppContext);
	const [showSettings, setShowSettings] = useState(false);

	let markup = (
		<>
			<Title title={`Welcome ${user?.uN || ''}`} />
			<StyledButton label={'New Game'} navigate={Pages.NEWGAME} />
			<StyledButton label={'Join Game'} navigate={Pages.JOINGAME} />
			<StyledButton label={'Settings'} onClick={() => setShowSettings(true)} />
			{process.env.REACT_APP_DEV_FLAG === '1' && <StyledButton label={'Sample'} navigate={Pages.SAMPLE} />}
			<StyledButton label={'Logout'} onClick={logout} />
			<PlatformSpecs>{`Platform: ${process.env.REACT_APP_PLATFORM}`}</PlatformSpecs>
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
