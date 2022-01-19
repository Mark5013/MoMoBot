//Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

//Creates a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
//adds the commands to commandFiles array
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//adds the events to eventFiles array
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


for(const file of eventFiles) {
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    //Set a new item in the Collection
    //Wih the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

//When the client is ready, this code will run once and print "Online!"
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) { return; }

    const command = client.commands.get(interaction.commandName);

    if(!command) { return; }

    try { 
        await command.execute(interaction);
    } catch(error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

//Login to Discord with client's token
client.login(token);