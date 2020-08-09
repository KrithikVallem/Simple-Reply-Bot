const bot = {
    token: "tokenABC123", 
    prefix: '$', 
    argSeparatorRegex: " +", 
    replyToMentions: false,
    spaceBetweenCommandAndArgs: true,
    replies: {},
} // argSeparator doesn't include // around because it is straight regex

bot.prefix = "++";

bot.replies = {
    ping: 'pong',
    greet: 'hi!',
    members: "`there are ${Guild.memberCount} members`", // how to include discord.js stuff like author or guild,
    speak: ['hello', {tts: true}], // use messageoptions, provide discord.js object as second parameter
    embed: [{embed: {description: "A very simple Embed!"}}], // send obj only also works
    echo: args => args.join(" "),
    sum: getSum, // pass a function in to use args
    countMembers: () => "`there are ${Guild.memberCount} members`",
}

bot.replies.list = Object.entries(bot.replies);

bot.repliesWithoutMention = {
    // nevermind, I'm making it no mention by default, and allowing mentions inside template string
}

// replies without prefix -- not supporting
// replies without a ping (message.channel.send)

launch(bot);

function getSum(args) { // function only needs to take in args array
    args = args.map(x => parseInt(x, 10));
    let sum = args.reduce((acc,curr) => acc+curr, 0);
    return sum;
}

// users code
// ------------------
// my code

function launch(bot) {
    let msg = "++sum 19    2     8   3";
    //msg = "++echo Hello World Echoed"
    msg = "++list";
    const Guild = {memberCount: 101};

    for (const command in bot.replies) {
        const getArgs = () => {
            let argSeparator = new RegExp(bot.argSeparatorRegex);
            return msg
                    .slice(bot.prefix.length + command.length + 1)
                    .split(argSeparator)
                    ;
        }

        if (!msg.startsWith(bot.prefix + command)) continue;

        
        let reply = bot.replies[command];

        // allow user to call function using args
        if (typeof reply === "function") {
            reply = reply(getArgs());
        }

        // force this to be a template string since non-template strings made by adding cound start/end with a variable not mini-string
        // pass in template string, allowing an extra if not elif allows a function to return a template string to evaluate
        if (typeof reply === "string" && reply.startsWith("`") && reply.endsWith("`")) {
            reply = eval(reply);
        }

        console.log(reply);
    }
}
