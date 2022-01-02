import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './about.scss';

const About = () => {
	const { user } = useSelector((store: IStore) => store);

	const renderLocalContent = () => (
		<div className="content">
			<h3>
				Hello! <br />
				Thank you for using this app :)
			</h3>
			<p>
				We tried to cover all the rules of Singapore Mahjong here, but it still has some limitations. Do read
				through the following to understand the app better.
			</p>
			<br />
			<h4>Creating a new game</h4>
			<ul>
				<li>
					When searching for a user, you have to spell out their username exactly as it is, i.e. capitals and
					all.
				</li>
				<li>
					There is no rolling of dice to decide on player seats (hence the 'Randomize' option on the New Game
					page).
				</li>
				<li>
					Note the 'Options' available (choosing Shooter or Half-Shooter doesn't have any effect on gameplay
					for now)
				</li>
				<li>
					The game will not let you Hu if you do not meet the minimum Tai. Currently the Maximum Tai is 5.
				</li>
			</ul>

			<h4>Controls</h4>
			<ul>
				<li>
					To Chi a tile thrown by the previous player (e.g. 2万), select the other two (e.g. 1万, 3万) in your
					hand and the Chi button (吃) will light up. Press on it to chi.
				</li>
				<li>
					If you can Pong or Kang a discarded tile, a popup will appear offering you the options. Optionally,
					you can select the tiles in your hand you want to Pong/Kang with the last discarded tile, and the
					Pong button (碰) will light up. This button will read '杠' instead if you can Kang. Press on it to
					Pong or Kang
					<br />
					You can also Kang if you select 4 of the same tile in your hand, or 1 tile when you've already
					Pong'd it. You can only do this after you've drawn or taken a tile, during your turn. The game will
					automatically draw replacement tiles (補花) for you.
				</li>
				<li>
					Draw (摸) and Discard (丢) buttons on the right will light up only when it's your turn. Note that
					you can only discard when it is your turn, after you've drawn or taken a tile.
				</li>
				<li>
					If 15 tiles are left, the Draw button will read '完' instead. The next player to draw has to press
					on it to end the round. If anyone tries to draw replacement tiles (補花) and there are 15 tiles
					left, the game will also end in a draw.
				</li>
				<p style={{ fontStyle: 'italic' }}>
					Paiseh ah, the buttons are in Chinese for now because using English leads to some big buttons and
					meh UI. Still thinking about this though.
				</p>
				<br />
			</ul>

			<h4>Gameplay</h4>
			<ul>
				<li>A glowing flower tile means that it is that player's flower tile, i.e. + 1 Tai.</li>
				<li>
					No instant payout (yet)! <br />
					After the game starts, if someone has matching flower tiles, check the logs (top right) to see if
					they had them in the initial hand. If so, the logs will be like: <br />
					"Player received 13 tiles, including 猫, 老鼠" <br />
					... <br />
					"Player buhua, received 2 tiles"
					<br />
					<br />
					Compared to something like:
					<br />
					"Player received 13 tiles, including 猫"
					<br />
					...
					<br /> "Player buhua, received 老鼠" <br />
					...
					<br /> "Player buhua, received 1 tile"
				</li>
				<li>
					There is also no automatic sending of chips on player Hu. To send another player chips, you can open
					the 'Send Money' panel (top right), or after somebody wins, an option will appear on the popup. When
					chips are sent, it will be logged in the top right, and player balances will be updated.
				</li>
				<li>
					The 'Waiting...' alert will show when someone can Pong, Kang, or Hu on a tile discarded (irl we can
					shout but over an app things are different). The default timeout is 6s.
				</li>
				<li>
					If more than one person can take the last throw tile (for Hu, Pong, etc) the timeout will be 12s.
					The first person with priority to Hu will see the option first. If they don't Hu, others can take
					the tile after the first 6s are up. So act quickly, until we come up with another solution :,)
				</li>
				<li>
					Playing accross different timezones is not recommended! This is because of how the delay system
					works... We're working on it.
				</li>
			</ul>

			<h4>How to Hu</h4>
			<ul>
				<li>
					When you can Hu, a show button (开?) will appear in the bottom right. After you press that, a second
					one will appear on the left (开!). Press that to show your tiles. <br />
					After pressing the second button, note that your tiles are shown to everyone, and no one can perform
					any actions. If you close the popup, you will hide your hand and the game will resume. (Warning ah -
					if a bot is next, it will play immediately)
				</li>
				<li>
					When you Hu, the game will automatically put the last discarded tile next to your hand if you
					haven't drawn a tile, provided it is available. If you cancel the Hu, it will be returned it to
					whoever discarded it. There is no zha-hu (詐胡) functionality.
				</li>
				<li>
					The creator of the game has access to Admin controls, where they can turn on or off 'Manual Hu'. If
					Manual Hu is on, anyone can Hu at any time (click the right, then left 开 buttons).
				</li>
				<li>
					The app will try to calculate how many points your hand is worth when you Hu. Note that not
					everything is accounted for, e.g. if you and your friends want to consider a certain hand 2 Tai
					instead of 4, be sure to use the Tai/Self Drawn options presented after pressing the second 开.
				</li>
				<li>
					Note that if A can Hu and Pong, and B can Hu, in the first 6s, A will see the Hu option, and B will
					not see any options. In the next 6s, bot A and B will see the Hu option, and A will NOT see the pong
					option. (Because it's not fair for A to pong when B can Hu right? Also, can Hu then just Hu lah)
				</li>
				<li>
					If A and B can Hu on a discarded tile (A has priority) and B Hu's, A will see an option to Hu in the
					announcement. A can use that to cancel B's Hu and take the last discarded tile instead.
				</li>
				<li>
					Note that if two players try to Hu at the same time, the game will only allow the first player to
					(if the second person has priority they will see the Hu option on the announcement popup).
				</li>
			</ul>

			<h4>Scoring</h4>
			<ul>
				<li>
					Most of the scoring logic follows this{' '}
					<a
						href="https://en.wikipedia.org/wiki/Singaporean_Mahjong_scoring_rules"
						style={{ color: '#005eff' }}
					>
						SG Mahjong Wiki page
					</a>
				</li>
				<li>
					The logic for Ping Hu hand follows standard rules: players cannot be waiting for a unique tile, and
					the pairs, if Pong'ed, cannot be worth Tai.
				</li>
				<li>
					Note that the following scenarios have not been accounted for:
					<ul>
						<li>Hidden Treasure (四暗刻/坎坎胡)</li>
						<li>8 Flower Tile-set (花胡)</li>
						<li>Winning on Replacement Tile (花上, 杠上)</li>
						<li>Robbing the Kang (抢杠)</li>
						<li>Heavenly & Earthly Hand (天胡, 地胡)</li>
					</ul>
				</li>
				<li>Note that All Green (綠一色) scores Man Tai</li>
				<li>There is no bao (包) functionality yet</li>
			</ul>

			<h4>When the round/game ends</h4>
			<ul>
				<li>
					In the case of draw (15 tiles left), the game will progress onto the next round and dealer if there
					was a Kang or someone drew matching flower tiles (animal pairs or their own flowers). If not, the
					round will be repeated.
				</li>
				<li>
					In online games (with than 1 person playing), after the round ends, only the next dealer will see
					the 'Next Round' button in the popup. If you are playing a full bot game (with 3 bots), you will
					always see it.
				</li>
				<li>
					Games will be deleted after 24 hours of inactivity, regardless of whether they are still ongoing or
					not.
				</li>
			</ul>
			<br />
			<p>
				This app does not collect any of your data, and for now you cannot reset your account or change your
				username. An email address can only be used to register one account. If you have any feedback or would
				like to get in touch, do drop us an email at mahjongsgapp@gmail.com.
			</p>
			<br />
			<h3>Thank you for reading. Have fun!</h3>
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				<Scrollable>{renderLocalContent()}</Scrollable>
				<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} />
			</Main>
		</HomeTheme>
	);

	// return <HomePage markup={markup} skipVerification={true} />;
};

export default About;
