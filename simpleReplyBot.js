export class simpleReplyBot {
    constructor(token) {
        this.token = token;
        this.prefix = "";
        this.commands = {};
    }
}

export function launch(bot) {
    const Discord = require('discord.js');
    const client = new Discord.Client();

    let messageOptions = {};

    client.on('message', message => {
        if (message.author.bot) return;
        if (!message.startsWith(bot.prefix)) return;

        // splits message into args separated by 1 or more spaces
        const getArgs = message => message.slice(bot.prefix.length + command.length + 1).split(/ +/);

        for (let command in bot.commands) {
            if (!message.startsWith(bot.prefix + command)) continue;

            let reply = bot.commands[command];

            // if reply is an array, then first item in array is the actual reply
            // and second item is the messageOptions provided as optional
            // second argument to message.channel.send
            if (Array.isArray(reply) && reply.length >= 2) {
                messageOptions = reply[1];
                reply = reply[0];
            }
            // same as above, but only a messageOptions object is provided
            else if (Array.isArray(reply) && reply.length === 1) {
                messageOptions = reply[0];
                reply = "";
            }

            // allow user to include commands that take arguments
            // user must pass in a function that accepts an array of strings:
            // echo: args => args.join(" ")
            if (typeof reply === "function") {
                reply = reply(getArgs());
            }

            // allow user to take advantage of discord.js api
            // user must pass in a string whose content is another string
            // of the backticks(template literal) variety:
            // members: "`There are ${Guild.memberCount} members`"
            // This must be an if, not else if, so that functions that return
            // template literals can be further processed:
            // members: args => "`there are ${Guild.memberCount} members`"
            if (typeof reply === "string" && reply.startsWith("`") && reply.endsWith("`")) {
                reply = eval(reply);
            }

            message.channel.send(reply, messageOptions);
            break;
        }
    });

    client.login(bot.token);
}
