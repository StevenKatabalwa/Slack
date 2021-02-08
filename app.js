const { SlackBot } = require('./service/slackbot')
require('dotenv').config();

let config = process.env;

const botConfigs = {
    signingSecret: config.SLACK_SIGNING_SECRET,
    token: config.BOT_API_TOKEN_KEY,
    name: config.BOT_NAME
};

const slackBot = new SlackBot(botConfigs);
slackBot.startReceive();