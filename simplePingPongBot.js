import { launch, simpleReplyBot } from './simpleReplyBot.js';

const bot = new simpleReplyBot("token");

bot.commands = {
    ping: 'pong',
}

launch(bot)
