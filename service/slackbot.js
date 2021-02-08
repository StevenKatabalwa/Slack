const { DataBricksService } = require('./databricks');
const { App } = require('@slack/bolt')

require('dotenv').config()

const dataBricksService = new DataBricksService();

class SlackBot {

    constructor(configs) {
        this.botConfig = configs;
        this.bot = new App(configs);
    }


    async sendMessage(channel, message) {

        const msg = {
            "token": this.botConfig.token,
            "channel": channel,
            "text": message
        }

        this.events.client.chat.postMessage(msg);
        console.log('message sent');

    }

    async replyInThread(channel, parentMessageThread, message) {

        const msg = {
            "token": this.botConfig.token,
            "channel": channel,
            "thread_ts": parentMessageThread,
            "text": message
        }

        this.bot.client.chat.postMessage(msg);

    }


    async startReceive() {

        const port = process.env.PORT;

        this.bot.event('app_mention', async ({ payload, event, client, say }) => {

            await this.runMessage(event);

        });

        this.bot.event('message', async ({ payload, event, client, say }) => {

            const { channel_type } = event;

            switch (channel_type) {

                case 'im':
                    await this.runMessage(event);
                    break;

            }

        });

        // Start the app
        const server = await this.bot.start(port);

        console.log(`⚡ Bolt app is running on port: ${server.address().port}!`);

    }


    runMessage = async (event) => {

        const { type, text, user, ts, channel } = event;

        try {

            const task = text.replace(/(<)+([@ # a-z A-Z 0-9]*)+>/, '').trim();

            console.log(task)

            dataBricksService.runJob(task).then((res) => {

                console.log(res)

                let response = `Response: ${JSON.stringify(res)}`;
                let msg = `Hi <@${user}>, you said ${task} 😎`;

                this.replyInThread(channel, ts, msg)
                this.replyInThread(channel, ts, response)


            }, (err) => {

                let msg = `Hi <@${user}>, I can't seem to help you because of: ${err} 😔`

                this.replyInThread(channel, ts, msg)

            })

        }
        catch (e) {
            console.log(`error responding ${e}`);
        }

    }


}

module.exports = { SlackBot }