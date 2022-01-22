const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let weather = require('weather-js');

//weather slash command that will display an embed with weather info of the desired area, either by city or zipcode
module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Displays weather of specfied area.')
        //Adds subcommand if user wants to search by city
        .addSubcommand(subCommand => 
            subCommand
            .setName('city')
            .setDescription('City you want to know weather of')
            .addStringOption(option => option.setName('place').setDescription('City Name')))
        //Adds subcommand if user wants to search by zip code
        .addSubcommand(subCommand => 
            subCommand
            .setName('zipcode')
            .setDescription('zip code of area')
            .addStringOption(option => option.setName('zip').setDescription('zip code of area'))),
    async execute(interaction) {
        const name = interaction.options.getSubcommand();
        //checks if the city subcommand was chosen
        if(name === 'city') {
            //gets the name of the city that the user inputted 
            const city  = interaction.options.getString('place');
            //if(interaction.getString('scale') !== 'F' || 'C' || 'f' || 'c') { interaction.reply('Invalid temperature scale') };
            weather.find({search: `${city}`, degreeType: 'F'}, function(err, result) {
                if(err) {
                    console.log(err);
                    interaction.reply('Something went wrong!');
                }
                console.log(result.length);
                console.log(result);
                if(result.length === 0 ) { 
                    interaction.reply("Invalid City name!");
                } else{
                    //creates embed with weather data
                    const cityEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${result[0].location.name} Weather Report`)
                        .setThumbnail(`${result[0].current.imageUrl}`)
                        .addFields(
                            {name: 'Temperature', value: `${result[0].current.temperature}`},
                            {name: '\u200B', value: '\u200B'},
                            {name: 'Weather', value: `${result[0].current.skytext}`, inline: true},
                            {name: 'Humidity', value: `${result[0].current.humidity}`, inline: true},
                            {name: 'Wind Speed', value: `${result[0].current.windspeed}`, inline: true});
                //sends the embed
                interaction.reply({ embeds: [cityEmbed] });
                }
            })
        //checks if the zipcode subcommand was chosen
        } else if(name === 'zipcode') {
            //gets the zipcode that was entered by the user
            const zip = interaction.options.getString('zip');
            weather.find({search: `${zip}`, degreeType: 'F'}, function(err, result) {
                if(err) { 
                    console.log(err)
                    interaction.reply('Something went wrong!');
                }
                if(result.length === 0) { 
                    interaction.reply("Invalid zip code!")
                } else {
                    //creates embed with weather data
                    const zipEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${result[0].location.name} Weather Report`)
                        .setThumbnail(`${result[0].current.imageUrl}`)
                        .addFields(
                            {name: 'Temperature', value: `${result[0].current.temperature}`},
                            {name: '\u200B', value: '\u200B'},
                            {name: 'Weather', value: `${result[0].current.skytext}`, inline: true},
                            {name: 'Humidity', value: `${result[0].current.humidity}`, inline: true},
                            {name: 'Wind Speed', value: `${result[0].current.windspeed}`, inline:true});
                    //sends embed
                    interaction.reply({ embeds: [zipEmbed] });
                }
            })
        //if neither is chosen, this will execute
        } else {
            await interaction.reply('Invalid Input');
        }
    }
}