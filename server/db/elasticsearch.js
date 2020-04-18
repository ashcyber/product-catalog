/* eslint-disable no-console */
const { Client } = require('@elastic/elasticsearch')

const client = new Client({ node: 'http://localhost:9200' })

client.ping().then(() => {
  console.log('Elastic Search Cluster is Up')
}).catch(() => {
  console.log('Elastic Search Cluster is Down')
})

module.exports = client
