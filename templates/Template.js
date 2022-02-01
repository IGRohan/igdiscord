module.exports.commandTemplate = (name) => `const { Permissions, Client, Message } = require('discord.js')

module.exports = {
    name: '${name}',
    description: 'Fill In',
    aliases: [],
    usage: '',
    permissions: [],
    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async(client, message, args) => {
        
    }
}`

module.exports.packageJson = (name) => `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "start": "node ."
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
      "discord.js": "^13.6.0",
      "dotenv": "^15.0.0"
    }
  }
  `

module.exports.envExample = (token) => `PREFIX=.
TOKEN=${token}`