/**
 * ============= THIS IS JUST A PRACTICE DOC TO UNDERSTAND ES ========================
 * ============= DOWN HERE ALL NOTES are mentioned about concepts and features learned ========
 *
 *
 *
 * *************  Notes for Query *************** 
 *  API DOCS https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
 *  Elatic Guide : https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
 * 
 * sort => age:desc | age.asc 
 * q=> key_field : value_term
 * from => start of the index 
 * size => length of the docs 
 * explain =>  boolean => Provides reason for the 
 * relevance score & order of items. 
 * .search({}) returns all results 
 *    - relevance score is same for all 1.0
 * 
 * "match_all" : {} => provide match all criteria 
 *    - empty {} returns all index docs 
 * 
 * get result => body.hits.hits
 * 
 * 
 * ******************* Full TEXT Search ***************
 * 
 * match phrases is useful to match sentences or quotes 
 * 
 * match_phrase_prefix => search only the prefix 
 * 
 * common and cutoff_frequency => can be used to match certain keywords 
 *  => for example matching "it is awesome" in product reviews 
 * 
 *  query : { 
 *      common : {
 *          review: { 
 *              query: 'this is awesome', 
 *              cutoff_frequency: 0.001     
 *          }    
 *      }
 *  }
 * 
 * 
 * ******************* Boolean Queries *****************
 * must => clause that must appear 
 * should => may or may not, it is more relaxed search than must
 * must_not => inverse of must 
 * 
 * 
 */


const express = require('express') ;
const { Client } = require('@elastic/elasticsearch'); 
const bodyParser = require('body-parser')
const app = express(); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const PORT = process.PORT || 3000;  

const client = new Client({ node: 'http://localhost:9200' })

app.get('/', (req,res) => { 
    res.send('<h1>Express response</h1>')
})

app.get('/create_index', async (req,res) => { 
    try { 
        let esResponse = await client.indices.create({
            index: 'products', 
        })

        if(esResponse) { 
            console.log(esResponse); 
        }
    }
    catch(error) { 
        console.log(error.message); 
    }
})

app.get('/insert_data', async (req, res) => { 
    try { 

        await client.index({
            index: 'products' , 
            body:  { 
                name: 'Xiaomi', 
                category : 'Mobile',
                price: 200, 
                color: 'Black',
                reviews: ['Cheap Phone', 'Good Durable Phone'] 
            }
        })

        await client.index({ 
            index: 'products', 
            body: { 
                name: 'iPhone', 
                category: 'Mobile', 
                price: 300, 
                color: 'Red', 
                reviews: ['Good Expensive Phone', 'Must buy']
            }
        })

        await client.index({
            index: 'products', 
            refresh: true, 
            body: { 
                name: 'Samsung Galaxy',
                category: 'Android Studio', 
                price: 3000, 
                color: 'Blue', 
                reviews: ['Excellent Phone', 'Long Battery'] 
            }
        })

        console.log('Inserted the data')
    }
    catch(error) { 
        console.log(error.message); 
    }
})


app.get('/search', async (req, res) => { 
    try { 

        /*   Q1 - Query Context   */
        // const { body } = await client.search({
        //     index: 'customers',
        //     q: 'state:kentucky', 
        //     sort: 'age:desc', 
        //     from: 1, 
        //     size: 3, 
        //     explain: true
        // })
        
        /* Q2 - multiple indices */ 
        // const { body } = await client.search({
        //     index: 'customers,products', 
        //     q: 'name:Samsung'
        // })

        /* Q3 - JSON Syntax */
        // const { body } = await client.search({
        //     index: 'customers', 
        //     body: {
        //         query: {
        //             match_all: {}
        //         }, 
        //         size: 2, 
        //         sort: { 
        //             age: {
        //                 order: 'asc'
        //             }
        //         }
        //     }
        // })

        /* Q4 - Term Search */
        // const { body } = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query:  { 
        //             term: {state: "alaska"}
        //         }
        //     }
        // })
            
        /* Q5 - filter fields by regex */
        // const {body} = await client.search({
        //     index: 'customers', 
            
        //     body: { 
        //         _source: ['st**', '*d*'],
        //         query: {
        //             term: {state: 'alaska'}
        //         }
        //     }
        // })

        /* Q6 - Filter fields includes / excludes */
        // const {body} = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         _source: { 
        //             includes: ['st*', '*n*'], 
        //             excludes: ['*der']
        //         }, 
        //         query: { 
        //             term: {state: 'alaska'}
        //         }
        //     }
        // })        
 
        /* Q7 - full text search */ 
        // const {body} = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query: { 
        //             match: {
        //                 state: 'alaska'
        //             }
        //         }
        //     }
        // })


        /* Q8 - Full text search with or */ 
        // const {body} = await client.search({
        //     index: 'customers',
        //     body: { 
        //         query: { 
        //             match: { 
        //                 state: { 
        //                     query: 'alaska washington', 
        //                     operator: 'or'
        //                 }
        //             }
        //         }
        //     }
        // })



        /* Q9 - Must Search Boolean */
        const {body} = await client.search({
            index: 'customers', 
            body: { 
                query: { 
                    bool: { 
                        must: [
                            {match : {state: 'alaska'}},
                            {match: {city: 'hamilton'}}
                        ]
                    }
                }
            }
        })


        res.json(body.hits.hits);
        
    }
    catch(error) { 
        console.log(error.message); 
    }
})

app.listen(PORT, () => { 
    console.log(`Demo App Listening to ${PORT}`)
})

client.ping().then(() => { 
    console.log('Elastic Search Cluster is Running');  
}).catch((err) => { 
    console.log('Elastic Search Cluster is Down'); 
})
