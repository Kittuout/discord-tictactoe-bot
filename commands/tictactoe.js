import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import { TicTacToeGame } from '../games/TicTacToeGame.js';

// Store active games by channel ID
const activeGames = new Map();

export const data = new SlashCommandBuilder()
  .setName('tictactoe')
  .setDescription('🎮 Play Tic Tac Toe with another player or against AI')
  .addUserOption(option =>
    option
      .setName('opponent')
      .setDescription('Choose your opponent (another player or the bot for AI)')
      .setRequired(true)
  )
  .setDMPermission(false);

export async function execute(interaction) {
  const opponent = interaction.options.getUser('opponent');
  const initiator = interaction.user;

  // Validation checks
  if (opponent.id === initiator.id) {
    return interaction.reply({
      content: '❌ You cannot play against yourself!',
      ephemeral: true,
    });
  }

  if (opponent.isBot && opponent.id !== interaction.client.user.id) {
    return interaction.reply({
      content: '❌ You can only play against this bot or another user!',
      ephemeral: true,
    });
  }

  // Check if there's already an active game in this channel
  if (activeGames.has(interaction.channelId)) {
    return interaction.reply({
      content: '⚠️ A game is already in progress in this channel! Finish it first.',
      ephemeral: true,
    });
  }

  // Determine if playing against AI
  const isAI = opponent.id === interaction.client.user.id;

  // Create game
  const game = new TicTacToeGame(
    {
      id: initiator.id,
      username: initiator.username,
      avatar_url: initiator.displayAvatarURL(),
    },
    {
      id: opponent.id,
      username: opponent.username,
      avatar_url: opponent.displayAvatarURL(),
    },
    isAI,
    interaction.channelId,
    initiator.id
  );

  // Start timeout
  game.startTimeout(() => {
    if (activeGames.has(interaction.channelId)) {
      activeGames.delete(interaction.channelId);
      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⏱️ Game Timed Out')
            .setDescription('The game was cancelled due to inactivity (2 minutes with no moves).')
            .setFooter({ text: 'Start a new game with /tictactoe' }),
        ],
      });
    }
  });

  // Store game
  activeGames.set(interaction.channelId, game);
  game.messageId = interaction.id;

  // Create initial message
  const startEmbed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎮 Tic Tac Toe - Game Started!')
    .setDescription(
      `**${initiator.username}** (❌ X) vs **${opponent.username}** (⭕ O)\n\n${initiator.username} goes first!`
    )
    .addFields(
      {
        name: '📊 Board',
        value: '⬜ ⬜ ⬜\n⬜ ⬜ ⬜\n⬜ ⬜ ⬜',
        inline: false,
      },
      {
        name: `${initiator.username} (X)`,
        value: '0 wins',
        inline: true,
      },
      {
        name: `${opponent.username} (O)`,
        value: '0 wins',
        inline: true,
      }
    )
    .setFooter({ text: 'Click a button to make your move' })
    .setTimestamp();

  await interaction.reply({
    embeds: [startEmbed],
    components: game.getGameButtons(),
  });

  // Store message ID for later updates
  const message = await interaction.fetchReply();
  game.messageId = message.id;
}

/**
 * Handle button interactions
 * Called from index.js when buttons are clicked
 */
export function handleButtonClick(interaction, activeGames) {
  const game = activeGames.get(interaction.channelId);

  if (!game) {
    return interaction.reply({
      content: '❌ No active game in this channel!',
      ephemeral: true,
    });
  }

  game.handleButtonClick(interaction).then(() => {
    if (game.gameOver) {
      activeGames.delete(interaction.channelId);
      game.clearTimeout();
    }
  });
}

// Export the games map for use in other files
export { activeGames };
