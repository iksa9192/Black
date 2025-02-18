global.ReadableStream = require('stream/web').ReadableStream;
require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');

const bots = [
    { token: process.env.TOKEN1, channelId: "1340329539028648017" },  // Room 1
    { token: process.env.TOKEN2, channelId: "1340329935079739466" },  // Room 2
    { token: process.env.TOKEN3, channelId: "1341327734533525586" },  // Room 3
    { token: process.env.TOKEN4, channelId: "1341327755060580382" },  // Room 4
    { token: process.env.TOKEN5, channelId: "1341327824111403039" },  // Room 5
    { token: process.env.TOKEN6, channelId: "1312999991614242826" },  // Room 6
    { token: process.env.TOKEN7, channelId: "1312182594485620756" },  // Room 7
    { token: process.env.TOKEN8, channelId: "1333338639433994260" },  // Room 8
    { token: process.env.TOKEN9, channelId: "1340330658626666577" },  // Room 9
    { token: process.env.TOKEN10, channelId: "1341325338520588319" }, // Room 10
    { token: process.env.TOKEN11, channelId: "1276620304713777275" }, // Room 11
    { token: process.env.TOKEN12, channelId: "1340777294473723956" }, // Room 12
    { token: process.env.TOKEN13, channelId: "1276620408874860667" }, // Room 13
    { token: process.env.TOKEN14, channelId: "1289967763280101419" }, // Room 14
    { token: process.env.TOKEN15, channelId: "1276619991940202496" }, // Room 15
    { token: process.env.TOKEN16, channelId: "1276620113600053248" }  // Room 16
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

bots.forEach(async (bot, index) => {
    await delay(index * 5000); // تأخير 5 ثوانٍ بين كل بوت

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    client.once('ready', async () => {
        console.log(`✅ Bot logged in as ${client.user.tag}`);

        const joinChannel = async () => {
            try {
                const channel = await client.channels.fetch(bot.channelId);
                if (!channel || channel.type !== ChannelType.GuildVoice) {
                    console.error(`❌ Invalid voice channel: ${bot.channelId}`);
                    return;
                }

                const existingConnection = getVoiceConnection(channel.guild.id);
                if (existingConnection) {
                    existingConnection.destroy();
                }

                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: true,
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    console.log(`⚠️ Bot ${client.user.tag} disconnected, reconnecting...`);
                    setTimeout(joinChannel, 5000);
                });

                console.log(`🎧 Bot joined voice channel: ${channel.name}`);
            } catch (err) {
                console.error(`❌ Error joining channel ${bot.channelId}:`, err);
                setTimeout(joinChannel, 10000);
            }
        };

        joinChannel();
    });

    client.login(bot.token).catch(err => console.error(`❌ Login failed for bot:`, err));
});
