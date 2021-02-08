const axios = require('axios')
const env = require('dotenv');


class DataBricksService {

    constructor() {
    }

    async runJob(job) {

        switch (job) {

            case 'br1':
                return this.callAPI1();
                break;

            case 'br2':
                return this.callAPI2();
                break;

            default:
                throw new Error('UNKNOWN JOB');

        }

        console.log(`Job is run here`);
    }

    async callAPI1(params) {

        return await axios.get('http://ff9cb4f86a05.ngrok.io').then((res) => {

            const {data} = res;
            const [items] = data

            return items;
        });


    }

    async callAPI2(params) {

    }

}

module.exports = { DataBricksService }