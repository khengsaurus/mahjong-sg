import { HomeButton } from 'platform/components/Buttons/TextNavButton';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main, Scrollable } from 'platform/style/StyledComponents';
import { useSelector } from 'react-redux';
import { PageName, Platform } from 'shared/enums';
import { ButtonText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import './misc.scss';

const Help = () => {
	const { user } = useSelector((store: IStore) => store);
	const platform = process.env.REACT_APP_PLATFORM === Platform.MOBILE ? 'app' : 'website';

	const renderLocalContent = () => (
		<div className="content">
			<h4>Controls</h4>
			<ul>
				<li>
					To Chi a tile thrown by the previous player, select the other two in your hand and the Chi button
					(吃) will light up. Press on it to chi.
				</li>
				<li>
					If you can Pong or Kang a discarded tile, a popup will appear offering you the options. Optionally,
					you can select the tiles in your hand you want to Pong/Kang with the last discarded tile, and the
					Pong button (碰) will light up. This button will read '杠' instead if you can Kang. Press on it to
					Pong or Kang.
					<br />
					You can also Kang if you select 4 of the same tile in your hand, or 1 tile when you've already
					Pong'ed it. You can only do this after you've drawn or taken a tile, during your turn.
				</li>
				<li>
					The Draw (摸) and Discard (丢) buttons on the right will light up only when it's your turn. Note
					that you can only discard when it is your turn, after you've drawn or taken a tile.
				</li>
				<li>
					The {platform} will automatically draw replacement tiles (補花) for you when you Kang or draw flower
					tiles.
				</li>
				<li>
					If 15 tiles are left, the Draw button will read '完' instead. The next player to draw has to press
					on it to end the round. If anyone tries to draw replacement tiles (補花) and there are 15 tiles
					left, the game will also end in a draw.
				</li>
				<p style={{ fontStyle: 'italic' }}>
					Paiseh ah, the buttons are in Chinese for now because using English leads to some big buttons and
					meh UI. We're still thinking about this though.
				</p>
				<br />
			</ul>

			<h4>Gameplay</h4>
			<ul>
				<li>A glowing flower tile means that it is that player's flower tile, i.e. + 1 Tai.</li>
				<li>
					No instant payout (yet). <br />
					After the game starts, if someone has matching flower tiles, check the logs to see if they had them
					in the initial hand. If so, the logs will be like: <br />
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
				<li>If a player gets both his flower tiles or bites (咬到) it will be shown in the logs.</li>
				<li>
					There is also no automatic sending of chips on player Hu. To send another player chips, you can open
					the 'Send Chips' panel (top right), or after somebody wins, an option will appear on the popup. When
					chips are sent, it will be logged in the top right, and player balances will be updated.
				</li>
				<li>
					The 'Waiting...' alert will show when someone can Pong, Kang, or Hu on a tile discarded. The default
					timeout is 6s.
				</li>
				<li>
					If more than one person can take the last throw tile (for Hu, Pong, etc) the timeout will be 12s.
					The first person with priority to Hu will see the option first. If they don't Hu, others can take
					the tile after the first 6s are up. So act quickly, until we come up with another solution :,)
				</li>
				<li>
					Playing accross different timezones is not recommended. This is because of how the delay system
					works... We're working on it.
				</li>
			</ul>

			<h4>How to Hu</h4>
			<ul>
				<li>
					The {platform} will not let you Hu if you do not meet the minimum Tai. Currently the Maximum Tai you
					can set is 5.
				</li>
				<li>
					When you can Hu, a show button (开?) will appear in the bottom right. After you press that, a second
					one will appear on the left (开!). Press that to show your tiles. <br />
					After pressing the second button, note that your tiles are shown to everyone, and no one can perform
					any actions. If you close the popup, you will hide your hand and the game will resume (careful ah -
					if a bot is next, it will play immediately).
				</li>
				<li>
					When you Hu, the {platform} will automatically put the last discarded tile next to your hand if you
					haven't drawn a tile, provided it is available. If you cancel the Hu, it will be returned to whoever
					discarded it. There is no fake-hu (詐胡) functionality.
				</li>
				<li>
					The creator of the game has access to Admin controls, where they can turn on or off 'Manual Hu'. If
					Manual Hu is on, anyone can Hu at any time (click the right, then left 开 buttons).
				</li>
				<li>
					The {platform} will try to calculate how many points your hand is worth when you Hu. Note that not
					everything is accounted for, e.g. if you and your friends want to consider a certain hand 2 Tai
					instead of 4, be sure to use the Tai/Self Drawn options presented after pressing the second 开.
				</li>
				<li>
					Note that if A can Hu and Pong, and B can Hu, in the first 6s, A will see the Hu option, and B will
					not see any options. In the next 6s, both A and B will see the Hu option, and A will NOT see the
					pong option (Because it's not fair for A to pong when B can Hu right? Also, can Hu then just Hu
					lah).
				</li>
				<li>
					If A and B can Hu on a discarded tile (A has priority) and B Hu's, A will see an option to Hu in the
					announcement. A can use that to cancel B's Hu and take the last discarded tile instead.
				</li>
				<li>
					Note that if two players try to Hu at the same time, the {platform} will only allow the first player
					to (if the second person has priority they will see the Hu option on the announcement popup).
				</li>
			</ul>

			<h4>Scoring</h4>
			<ul>
				<li>
					The scoring logic largely follows{' '}
					<a
						href="http://gambiter.com/mahjong/Singaporean_mahjong_scoring_rules.html"
						style={{ color: '#005eff' }}
					>
						this mahjong guide
					</a>
				</li>
				<li>
					The logic for a Ping Hu hand follows standard rules: players cannot be waiting for a unique tile,
					and the pairs, if Pong'ed, cannot be worth Tai.
				</li>
				<li>
					Note that the following scenarios have not been accounted for:
					<ul>
						<li>Hidden Treasure (四暗刻/坎坎胡)</li>
						<li>8 Flower Tile-set (花胡)</li>
						<li>Winning on Replacement Tile (花上, 杠上)</li>
						<li>Robbing the Kang (抢杠)</li>
						<li>Heavenly, Earthly and Humanly Hands (天胡, 地胡, 人胡)</li>
					</ul>
				</li>
				<li>Note that All Green (綠一色) scores Man Tai</li>
				<li>There is no bao (包) functionality yet</li>
			</ul>

			<h4>End of the round/game</h4>
			<ul>
				<li>
					In the case of draw (15 tiles left), the game will progress onto the next round if there was a Kang
					or someone drew matching flower tiles (animal pairs or their own flower tiles). If not, the round
					will be repeated.
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
				This {platform} currently does not support username change or password reset. An email address can only
				be used to register one account.
			</p>
			<br />
			<h4>Thank you for reading, and have fun</h4>
			<br />
		</div>
	);

	return (
		<HomeTheme>
			<Main>
				<Scrollable className="scrollable">{renderLocalContent()}</Scrollable>
				<div className="home-button">
					<HomeButton label={!!user ? PageName.HOME : ButtonText.BACK} />
				</div>
			</Main>
		</HomeTheme>
	);
};

export default Help;
