// require('dotenv').config();

const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '2077164135:AAHPoQqVd8bTZ8vd4QXoUEs0c1hX-LfkIWY';

// const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true});
const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I made a wish the number from 0 till 9. Try to guess the number!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Try right now!', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'First greeting'},
        {command: '/info', description: 'Get info'},
        {command: '/game', description: 'Try to guess the number!'}
    ]);
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://telegram.org.ru/uploads/posts/2017-04/1491296955_file_77780.jpg');
            return bot.sendMessage(chatId, `You are welcome to ${msg.from.first_name}-chanel`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.username}`);
        }
        if (text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'I do not understand you. Try again!');        
    });

    bot.on('callback_query', async msg => {
        // console.log(msg);
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return  bot.sendMessage(chatId, `Congratulations!! You had guessed the number ${chats[chatId]}`, againOptions);
        } else {
            return  bot.sendMessage(chatId, `Ops... You missed.. You had selected ${data}, but Bot made a wish the number ${chats[chatId]}`, againOptions);
        }
    });
};

start();