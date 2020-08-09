import { launch } from './simpleReplyBot.js';

const bot = {token: '...'}

bot.commands = {
    ping: 'pong',
}

launch(bot)
