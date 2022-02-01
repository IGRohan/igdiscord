require('dotenv').config()
const { client } = require('../index')

client.on('messageCreate', async message => {
    if(!message.guild) return;
    const prefix = process.env.PREFIX || "!"
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) ||
                client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))
    
    if(!message.member.permissions.has(cmd.permissions)) return message.reply('You do not have appropriate permissions to use this command!')
    if(!message.guild.me.permissions.has(cmd.permissions)) return message.reply('I do not have appropriate permissions to use this command!')
    if(cmd) cmd.run(client, message, args)
})