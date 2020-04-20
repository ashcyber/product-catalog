/* eslint-disable no-console */
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  cloud: {
    id: process.env.ES_CLOUD_ID
  },
  auth: {
    username: process.env.ES_CLOUD_USERNAME,
    password: process.env.ES_CLOUD_PASSWORD
  }
})

client.ping().then(() => {
  console.log('Elastic Search Cluster is Up')
}).catch(() => {
  console.log('Elastic Search Cluster is Down')
})

module.exports = client
