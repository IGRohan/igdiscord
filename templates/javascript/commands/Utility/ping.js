const { Permissions, Client, Message } = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Use this to check if the bot is alive or not',
    aliases: [],
    usage: '',
    permissions: [],
    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async(client, message, args) => {
        message.reply('pong')
    }
}