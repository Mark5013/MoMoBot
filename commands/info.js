const { SlashCommandBuilder } = require('@discordjs/builders');

//info slash command that will display basic user of server info depending on which one is selected by the user
module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays info based on input')
        //adds subcommand if the user wants another users basic info
        .addSubcommand(subcommand => 
            subcommand
                .setName('user')
                .setDescription('Displays basic user info')
                //adds option for the user to select another users profile
                .addUserOption(option => option.setName('target').setDescription('The user')))
        //adds subcommand if the user wants the basic server info
        .addSubcommand(subcommand => 
            subcommand
            .setName('server')
            .setDescription('Displays basic server info')),
        async execute(interaction) {
            //checks if the user subcommand was chosen
            if (interaction.options.getSubcommand() === 'user') {
                //gets the user that was selected
                const user = interaction.options.getUser('target');
                //checks if the user exists
                if (user) {
                    //sends basic user info if the user exists
                    await interaction.reply(`ID: ${user.id}\nAccount Creation time: ${user.createdAt}`);
                } else {
                    //if user doesn't exist, this will be sent
                    await interaction.reply("User doesn't exist!")
                }
            //checks if the server subcommand was chosen
            } else if(interaction.options.getSubcommand() === 'server') {
                //sends basic server info
                await interaction.reply(`Server Name: ${interaction.guild.name}\nMember Count: ${interaction.guild.memberCount}`);
            //this is sent if no subcommand is chosen
            } else {
                await interaction.reply("No subcommand was used")
            }
        }
        
};