const Discord = require('discord.js')
const { Intents } = require('discord.js')
const client = new Discord.Client({ intents: new Intents(1863) })
module.exports.client = client;
require('dotenv').config()
const fs = require('fs')

//Command Handler
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
function getDirectories() { 
    return fs.readdirSync("./commands/").filter(function subFolder(file) {
        return fs.statSync("./commands/" + file).isDirectory();
    })
}
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"))
for (const folder of getDirectories()) {
    const folderFiles = fs.readdirSync("./commands/" + folder).filter((file) => file.endsWith(".js"))
    for (const file of folderFiles) {
        commandFiles.push([folder, file])
    }
}
for (const file of commandFiles) {
    let command;
    if(Array.isArray(file)) {
        command = require(`./commands/${file[0]}/${file[1]}`)
    } else {
        command = require(`./commands/${file}`)
    }

    client.commands.set(command.name, command)
    console.log(`✅ Success! Loaded Command ${command.name}`);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(client.name) client.events.set(event.name, event)
}

client.login(process.env.TOKEN)