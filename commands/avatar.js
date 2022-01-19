const { SlashCommandBuilder } = require('@discordjs/builders');

//avatar slash commaned that will display the avatar of whatever user is selected
module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays users avatar')
        //adds option for the user to select the user that they want the profile picture of
        .addUserOption(option => option.setName('target').setDescription('User wanted')),
    async execute(interaction) {
        //gets the user the the user selected
        const user  = interaction.options.getUser('target');
        //checks if the user exits
        if(user) {
            //sends the selected users profile picture
            await interaction.reply(`${user.displayAvatarURL()}`);
        } else {
            //if users doesn't exist, this error message will be sent
            await interaction.reply("User doesn't exist");
        }
        
    },
};