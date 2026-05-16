# Discord Tic Tac Toe Bot 🎮

A fully functional Tic Tac Toe game bot for Discord with AI opponent, score tracking, and beautiful embeds.

## Features ✨

- ✅ **Slash Commands** - Easy to use `/tictactoe` command
- ✅ **Two Player Mode** - Play against your friends
- ✅ **AI Opponent** - Unbeatable AI using minimax algorithm
- ✅ **Interactive Grid** - Beautiful 3x3 button-based board
- ✅ **Turn Management** - Prevents out-of-turn moves
- ✅ **Win Detection** - All 8 win conditions checked
- ✅ **Draw Detection** - Recognizes draw games
- ✅ **Score Tracking** - Tracks wins during runtime
- ✅ **Timeout System** - Auto-cancel games after 2 minutes of inactivity
- ✅ **Colorful Embeds** - Professional Discord UI with dynamic colors
- ✅ **Permission Control** - Only players can interact with their game
- ✅ **Modular Code** - Clean, beginner-friendly code with comments

## Setup Instructions 🚀

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Discord Bot Token** ([Create Bot](https://discord.com/developers/applications))
- A Discord server where you can test the bot

### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** and give it a name (e.g., "Tic Tac Toe Bot")
3. Go to the **"Bot"** section on the left
4. Click **"Add Bot"**
5. Copy the **TOKEN** (this is your `DISCORD_TOKEN`)
6. Go to **"General Information"** tab and copy **CLIENT_ID** (this is your `CLIENT_ID`)

### Step 2: Set Up Project

```bash
# Clone or download the repository
cd discord-tictactoe-bot

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here_optional
```

**Note:** `GUILD_ID` is optional:
- **Leave it out** for global registration (takes 1-2 hours to sync)
- **Add it** for instant testing in a specific server (faster development)

To get `GUILD_ID`:
- Right-click your Discord server
- Select "Copy Server ID"

### Step 4: Invite Bot to Your Server

1. Go to **OAuth2** → **URL Generator** in Discord Developer Portal
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### Step 5: Register Commands

```bash
npm run register
```

Expected output:
```
📋 Starting command registration...

🔗 Registering commands to guild: your_guild_id
   (This is faster for testing, remove GUILD_ID to register globally)

✅ Successfully registered 1 command(s) to guild!

📋 Registered commands:
   ✓ /tictactoe - 🎮 Play Tic Tac Toe with another player or against AI

✨ Command registration complete!
```

### Step 6: Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Expected output:
```
🎮 Starting Tic Tac Toe Bot...

📂 Loading 1 command(s)...
✅ Loaded command: /tictactoe

🚀 Bot successfully connected to Discord!
✅ Logged in as: TicTacToeBot#1234
🆔 Client ID: 123456789
📊 Ready in 1 guild(s)

🎮 Tic Tac Toe Bot is online!
```

## Usage 🎮

In your Discord server, use the command:

```
/tictactoe @opponent
```

Replace `@opponent` with:
- **Another user** - Play a multiplayer game
- **The bot** - Play against AI

### How to Play

1. **Start the game** - Use `/tictactoe @opponent`
2. **Make moves** - Click buttons on the 3x3 board
3. **Win condition** - Get 3 symbols in a row (horizontal, vertical, or diagonal)
4. **Draw** - All 9 squares filled with no winner
5. **Game ends** - Automatically after win, draw, or 2 minutes of inactivity

### Game Features

- 🎯 **Turn indicator** - Shows whose turn it is
- ⏱️ **Timeout** - Game cancels after 2 minutes with no moves
- 🔒 **Permission control** - Only players can click buttons
- 📊 **Score tracking** - Displays wins during the session
- ⭕❌ **Clear symbols** - Easy to see game state

## Project Structure 📂

```
discord-tictactoe-bot/
├── index.js                    # Main bot file - event handlers & command loading
├── registerCommands.js         # Command registration script
├── package.json                # Node.js dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── commands/
│   └── tictactoe.js           # Slash command definition & game initialization
└── games/
    ├── TicTacToeGame.js       # Game logic, board state, win detection
    └── AIPlayer.js            # AI opponent using minimax algorithm
```

## Code Explanation 📝

### Main Bot (`index.js`)

Handles:
- Loading all commands from the `commands/` folder
- Discord events (ready, interactions)
- Slash command execution
- Button click interactions
- Game state management

### Game Logic (`games/TicTacToeGame.js`)

Manages:
- Board state (9 positions)
- Current player tracking
- Move validation
- Win/draw detection (8 win conditions)
- Turn management
- Timeout system (2 minutes)
- Score tracking
- Beautiful embed generation

### AI Player (`games/AIPlayer.js`)

Features:
- **Minimax algorithm** - Perfect strategy
- **Unbeatable** - Will never lose
- **Optimal play** - Always makes the best move
- **Game tree evaluation** - Looks ahead to determine best moves

### Slash Command (`commands/tictactoe.js`)

Does:
- Defines `/tictactoe` command with user option
- Validates players (can't play against self)
- Creates new game instances
- Handles button interactions
- Manages game lifecycle

## Troubleshooting 🛠️

### Bot doesn't respond to commands

**Problem:** `/tictactoe` command doesn't appear

**Solution:**
1. ✅ Verify bot is online: `npm start`
2. ✅ Check token is correct in `.env`
3. ✅ Ensure bot has "applications.commands" scope
4. ✅ Re-register commands: `npm run register`
5. ✅ Wait a few minutes for global sync (if not using `GUILD_ID`)

### "Command not found" error

**Solution:**
1. Add `GUILD_ID` to `.env` for instant registration
2. Run `npm run register` again
3. Restart the bot: `npm start`

### Bot shows offline

**Solution:**
1. Check `DISCORD_TOKEN` is correct in `.env`
2. Verify bot account exists in Developer Portal
3. Check bot has been invited to the server
4. Look for error messages in console

### Game buttons don't work

**Solution:**
1. Ensure bot has "Send Messages" and "Embed Links" permissions
2. Check that only game players are clicking buttons
3. Verify game hasn't timed out (2-minute limit)

### AI makes slow moves

- This is normal! The minimax algorithm evaluates many positions
- Try running on a faster machine or adjust the algorithm

## Customization 🎨

### Change AI Difficulty

The AI is currently unbeatable. To make it easier, edit `games/AIPlayer.js`:

```javascript
getMove(board) {
  // Add randomness occasionally (30% chance of random move)
  if (Math.random() < 0.3) {
    const availableMoves = board
      .map((cell, i) => cell === null ? i : null)
      .filter(x => x !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Otherwise use minimax
  // ... rest of the code
}
```

### Change Timeout Duration

Edit `games/TicTacToeGame.js`:

```javascript
startTimeout(callback) {
  this.timeoutId = setTimeout(() => {
    this.gameOver = true;
    callback();
  }, 120000); // Change milliseconds here (120000 = 2 minutes)
}
```

Examples:
- 60000 = 1 minute
- 180000 = 3 minutes
- 300000 = 5 minutes

### Customize Game Embed

Edit `getGameEmbed()` method in `games/TicTacToeGame.js`:

```javascript
const embed = new EmbedBuilder()
  .setColor('#YOUR_COLOR_HEX') // Change color
  .setTitle('Your Custom Title')
  .setDescription('Your description')
  // Add more fields...
```

Discord colors:
- `#5865F2` - Blurple (default)
- `#43B581` - Green (win)
- `#FFA500` - Orange (draw)
- `#FF0000` - Red (error)

### Add More Embeds or Features

All code is modular and well-commented. Key areas to modify:

- **Game flow:** `commands/tictactoe.js` and `games/TicTacToeGame.js`
- **Bot logic:** `index.js` (event handlers)
- **AI strategy:** `games/AIPlayer.js` (minimax algorithm)

## Performance Notes 📊

- **Minimax algorithm:** O(9!) in worst case, but with alpha-beta pruning could optimize to O(9)
- **Board state:** Minimal memory usage (~80 bytes per game)
- **Active games:** Limited by Discord rate limits and server resources
- **Timeout system:** Prevents memory leaks from inactive games

## Technologies Used 🛠️

- **Node.js** - JavaScript runtime
- **Discord.js** - Discord API library
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

## License 📄

MIT License - Feel free to use and modify!

## Contributing 🤝

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Support 💬

For issues or questions:

1. Check the **Troubleshooting** section above
2. Review [Discord.js documentation](https://discord.js.org/)
3. Check bot console output for error messages
4. Create an issue on GitHub with details

---

**Enjoy playing Tic Tac Toe on Discord! 🎮✨**

Made with ❤️ using Discord.js

Need help? [Discord.js Guide](https://discordjs.guide/) | [Discord Developer Portal](https://discord.com/developers/applications)
