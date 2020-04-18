/* eslint-disable */
const client = require('../db/elasticsearch')
const fs = require('fs')
const path = require('path')
const rawData = fs.readFileSync(path.join(__dirname, 'productES.json'))
const dataset = JSON.parse(rawData)

;(async () => { 
    let response; 

    let query = {
        index: 'products', 
        body: {
            mappings: { 
                properties: {
                    name: String,
                    description: String,
                    price: Number,
                    image: String,
                    vendor: String,
                    category: String,
                    slug: String
                  }
                }
            }
        }

    try { 
        let { body } = await client.indices.create(query)

        response = body.acknowledged
    }
    catch(error) {
        if(error.message = 'resource_already_exists_exception') {
            await client.indices.delete({
                index: query.index
            })
            
            let { body } = await client.indices.create(query)

            response = body.acknowledged
            console.log(`Index Already Exists: Removed`) 

        }
    }

    if(response) {
        console.log('Index Created')
    }
    else {
        console.log('Problem Creating index')
    }
    let body  = []; 
    dataset.map(d => {
        body.push({ index: { _index: query.index } })
        body.push(d)
    })

    // Bulk Write Data from productes.json 
    const { body: bulkResponse } = await client.bulk({ refresh: true, body })

    if(bulkResponse.errors) {
        console.log('Error inserting data')
    }
    else {
        const { body } = await client.count({index: query.index})
        console.log(`Inserted ${body.count} documents`)
    }

})()