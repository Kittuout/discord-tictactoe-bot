import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { AIPlayer } from './AIPlayer.js';

/**
 * Tic Tac Toe Game Class
 * Manages game state, logic, and interactions
 */
export class TicTacToeGame {
  constructor(player1, player2, isAI = false, channelId, initiatorId) {
    this.player1 = player1; // Object with id, username, avatar_url
    this.player2 = player2;
    this.isAI = isAI;
    this.channelId = channelId;
    this.initiatorId = initiatorId;
    this.messageId = null;
    this.timeoutId = null;

    // Game state
    this.board = Array(9).fill(null); // 0-8 positions
    this.currentPlayerIndex = 0; // 0 = player1, 1 = player2
    this.gameOver = false;
    this.winner = null;
    this.isDraw = false;

    // Score tracking
    this.scores = {
      [player1.id]: 0,
      [player2.id]: 0,
    };

    // AI player
    this.ai = isAI ? new AIPlayer('O') : null;

    // Win conditions (combinations of board positions)
    this.winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    console.log(`🎮 New game created: ${player1.username} vs ${isAI ? 'AI' : player2.username}`);
  }

  /**
   * Get current player object
   */
  getCurrentPlayer() {
    return this.currentPlayerIndex === 0 ? this.player1 : this.player2;
  }

  /**
   * Get current player symbol (X or O)
   */
  getCurrentSymbol() {
    return this.currentPlayerIndex === 0 ? 'X' : 'O';
  }

  /**
   * Get opponent player object
   */
  getOpponentPlayer() {
    return this.currentPlayerIndex === 0 ? this.player2 : this.player1;
  }

  /**
   * Get opponent symbol
   */
  getOpponentSymbol() {
    return this.currentPlayerIndex === 0 ? 'O' : 'X';
  }

  /**
   * Handle button click interaction
   */
  async handleButtonClick(interaction) {
    // Extract position from button custom ID
    const position = parseInt(interaction.customId.split('_')[1]);

    // Check if game is already over
    if (this.gameOver) {
      return interaction.reply({
        content: '❌ This game has already ended!',
        ephemeral: true,
      });
    }

    // Validate it's the right player's turn
    const currentPlayer = this.getCurrentPlayer();
    if (interaction.user.id !== currentPlayer.id) {
      return interaction.reply({
        content: `❌ It's ${currentPlayer.username}'s turn! Wait your turn.`,
        ephemeral: true,
      });
    }

    // Validate position is not already taken
    if (this.board[position] !== null) {
      return interaction.reply({
        content: '❌ That position is already taken!',
        ephemeral: true,
      });
    }

    // Reset timeout
    this.resetTimeout();

    // Make the move
    this.makeMove(position);

    // Check for win or draw
    this.checkGameEnd();

    // Update message
    await interaction.update({
      embeds: [this.getGameEmbed()],
      components: this.getGameButtons(),
    });

    // If AI is playing and game isn't over, make AI move
    if (this.isAI && !this.gameOver && this.currentPlayerIndex === 1) {
      // Delay AI move for better UX
      setTimeout(() => {
        this.makeAIMove(interaction);
      }, 1000);
    }
  }

  /**
   * Make a move on the board
   */
  makeMove(position) {
    const symbol = this.getCurrentSymbol();
    this.board[position] = symbol;
    console.log(`📍 ${this.getCurrentPlayer().username} (${symbol}) played at position ${position}`);
  }

  /**
   * Make AI move
   */
  async makeAIMove(interaction) {
    if (this.gameOver) return;

    const aiMove = this.ai.getMove(this.board);
    this.makeMove(aiMove);
    this.checkGameEnd();

    try {
      await interaction.message.edit({
        embeds: [this.getGameEmbed()],
        components: this.getGameButtons(),
      });
    } catch (error) {
      console.error('Error updating message after AI move:', error);
    }
  }

  /**
   * Check for win or draw conditions
   */
  checkGameEnd() {
    // Check for win
    for (const condition of this.winConditions) {
      const [a, b, c] = condition;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.gameOver = true;
        this.winner = this.getCurrentPlayer();
        this.scores[this.winner.id]++;
        console.log(`🎉 ${this.winner.username} won!`);
        return;
      }
    }

    // Check for draw
    if (this.board.every(cell => cell !== null)) {
      this.gameOver = true;
      this.isDraw = true;
      console.log('🤝 Game is a draw!');
      return;
    }

    // Switch to next player
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }

  /**
   * Generate game embed
   */
  getGameEmbed() {
    let title = '';
    let color = '#5865F2'; // Discord blurple
    let description = '';

    if (this.gameOver) {
      color = this.isDraw ? '#FFA500' : '#43B581'; // Orange for draw, green for win

      if (this.isDraw) {
        title = '🤝 Game Over - Draw!';
        description = 'Neither player could get three in a row!';
      } else {
        title = `🎉 ${this.winner.username} Won!`;
        description = `Congratulations ${this.winner}! You've won the game!`;
      }
    } else {
      const currentPlayer = this.getCurrentPlayer();
      title = `🎮 Tic Tac Toe - ${currentPlayer.username}'s Turn`;
      description = `${currentPlayer.username} (${this.getCurrentSymbol()}) is playing`;
      color = '#5865F2';
    }

    // Build board display
    let boardText = this.getBoardDisplay();

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .addFields(
        {
          name: '📊 Board',
          value: boardText,
          inline: false,
        },
        {
          name: `${this.player1.username} (X)`,
          value: `${this.scores[this.player1.id]} wins`,
          inline: true,
        },
        {
          name: `${this.player2.username} (O)`,
          value: `${this.scores[this.player2.id]} wins`,
          inline: true,
        }
      )
      .setFooter({
        text: this.gameOver ? 'Game Over' : 'Click a button to make your move',
      })
      .setTimestamp();

    return embed;
  }

  /**
   * Get board display as emoji grid
   */
  getBoardDisplay() {
    const emojis = [];
    for (let i = 0; i < 9; i++) {
      const cell = this.board[i];
      if (cell === 'X') emojis.push('❌');
      else if (cell === 'O') emojis.push('⭕');
      else emojis.push('⬜');
    }

    return `${emojis[0]} ${emojis[1]} ${emojis[2]}\n${emojis[3]} ${emojis[4]} ${emojis[5]}\n${emojis[6]} ${emojis[7]} ${emojis[8]}`;
  }

  /**
   * Generate game board buttons
   */
  getGameButtons() {
    const rows = [];

    for (let row = 0; row < 3; row++) {
      const buttons = [];

      for (let col = 0; col < 3; col++) {
        const position = row * 3 + col;
        const cell = this.board[position];

        let label = ' ';
        if (cell === 'X') label = '❌';
        else if (cell === 'O') label = '⭕';

        const button = new ButtonBuilder()
          .setCustomId(`ttt_${position}`)
          .setLabel(label || '　') // Non-breaking space for empty cells
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(this.gameOver || cell !== null);

        buttons.push(button);
      }

      const row_obj = new ActionRowBuilder().addComponents(buttons);
      rows.push(row_obj);
    }

    return rows;
  }

  /**
   * Start timeout for inactivity (2 minutes)
   */
  startTimeout(callback) {
    this.timeoutId = setTimeout(() => {
      this.gameOver = true;
      console.log('⏱️ Game timed out due to inactivity');
      callback();
    }, 120000); // 2 minutes
  }

  /**
   * Reset timeout
   */
  resetTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Clear timeout when game ends
   */
  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
