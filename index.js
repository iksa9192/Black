global.ReadableStream = require('stream/web').ReadableStream;
require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const bots = [
    { token: process.env.TOKEN1, channelId: "1340329539028648017" },
    { token: process.env.TOKEN2, channelId: "1340329935079739466" },
    { token: process.env.TOKEN3, channelId: "1341327734533525586" },
    { token: process.env.TOKEN4, channelId: "1341327755060580382" },
    { token: process.env.TOKEN5, channelId: "1341327824111403039" },
    { token: process.env.TOKEN6, channelId: "1312999991614242826" },
    { token: process.env.TOKEN7, channelId: "1312182594485620756" },
    { token: process.env.TOKEN8, channelId: "1333338639433994260" },
    { token: process.env.TOKEN9, channelId: "1340330658626666577" },
    { token: process.env.TOKEN10, channelId: "1341325338520588319" },
    { token: process.env.TOKEN11, channelId: "1276620304713777275" },
    { token: process.env.TOKEN12, channelId: "1340777294473723956" },
    { token: process.env.TOKEN13, channelId: "1276620408874860667" },
    { token: process.env.TOKEN14, channelId: "1289967763280101419" },
    { token: process.env.TOKEN15, channelId: "1276619991940202496" },
    { token: process.env.TOKEN16, channelId: "1276620113600053248" }
];

const createBotClient = (bot) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    client.once('ready', async () => {
        console.log(`✅ ${client.user.tag} جاهز!`);
        await joinVoice(bot, client);
    });

    client.login(bot.token).catch(err => console.error(`❌ فشل تسجيل الدخول: ${err.message}`));
};

const joinVoice = async (bot, client) => {
    try {
        const channel = await client.channels.fetch(bot.channelId);
        if (!channel) {
            console.error(`❌ القناة غير موجودة: ${bot.channelId}`);
            return;
        }
        if (channel.type !== ChannelType.GuildVoice) {
            console.error(`❌ ${bot.channelId} ليست قناة صوتية.`);
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        console.log(`🎧 ${client.user.tag} انضم إلى القناة الصوتية: ${channel.name}`);

        connection.on('stateChange', (oldState, newState) => {
            console.log(`🔄 حالة الاتصال لـ ${client.user.tag}: ${oldState.status} -> ${newState.status}`);
            if (newState.status === 'Disconnected') {
                console.error(`❌ ${client.user.tag} فقد الاتصال!`);
            }
        });
    } catch (error) {
        console.error(`❌ حدث خطأ أثناء الانضمام للقناة: ${error.message}`);
    }
};

// تشغيل كل بوت بشكل مستقل
bots.forEach(async (bot, index) => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // تأخير 5 ثوانٍ
    createBotClient(bot);
});
