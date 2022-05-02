# Mahjong SG

## About

A React Firebase Mahjong app with Singapore scoring rules.
Offers P-v-P and P-vs-bot modes, calculation of hand points, account-management and custom theming.

## Persistence

Games and User information are persisted as NoSQL documents. Reading and writing are delegated to the Service Layer:

-   user related & online games: Firestore
-   bot games: localStorage

Help, About, Policy, and Notification content are maintained on a separate Express server.

## UI

Material-UI is used extensively, with much of the theming managed with MUI's styling. Combined with SASS and styled-components, this allows for a reactive, highly customisable game experience to suit users' preferences.

## Hand calculations

Hands are evaluated so that the app can recognize when someone can Pong, Kang or Hu, correctly allocate a delay for them, and prompt them to do so. The app also needs to detect the value of a hand when a user can Hu as a means of scoring and validation.

As these calculations are run for users individually when they draw a new tile and for every user whenever a tile is discarded, they can be expensive (each hand has to be broken down and the tiles permuatated into different melds, each combination to be checked if it comprises a valid hand) and are optimised to run only when needed as React effects triggered by changes in dependencies.

## The Bot

Note that 'bot' here is not an AI but refers to a collective of scripts run to make decisions in order to progress the game. The bot functions by assessing its own hand, tiles show on the table, and what it has already melded. It then sets several goals, including whether it should go for Pong/Chi hand, keep Dragon tiles, and if it should prioritise any suits etc.

When given the opportunity to meld a tile, it will only do so if melding aligns with its pre-determined goals. When discarding tiles, it prioritises tiles that do not align with its goals and tiles it is not likely to meld. The bot does not aim for any specific combination but rather to 'keep its options open'. It does not play defensively and will Hu when the opportunity arises.

The 'Easy AI' mode works simply by introducting a 50% chance that the bot will take when it can Pong, Kang or Chi.

E.g., The bot has a hand like (1W, 2W, 3W, 1T, 2T, 3T...) and calculates that a Chi-hand is more achievable than a Pong-hang. If it is presented the opportunity to Pong, it will decline. It will also prioritise discarding Dragon tiles, as a valid Chi-hand cannot contain any Dragon tiles in Singapore Mahjong.

## Published

-   Online: https://mahjong-sg.com
-   App Store: https://apps.apple.com/sg/app/mahjong-sg/id1608389963
-   Play Store: https://play.google.com/store/apps/details?id=com.tk.mahjongSg
