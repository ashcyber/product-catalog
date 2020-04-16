/**
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
 * ****************** Aggregation Query *************** 
 * Types: 
 * 1) Metric 
 * 2) Bucketing 
 * 3) Matrix
 * 4) Pipeline  
 * 
 * 
 * Matrix Aggregation: 
 *    - Aggregation over set of docs 
 *    - documents in search results 
 *    - documents in logical group 
 *    -
 * Bucketing: 
 *    - logical group documents based on search query 
 *    - document falls into bucket if criteria match 
 * 
 * 
 * Pipeline: 
 *   - out of one step is input to other 
 * 
 * Metric: 
 *   - sum avg count ...etc 
 * 
 * 
 * 
 * aggs: cardinality to find unique value count 
 * 
 * !! in elastic search field data such as gender is 
 * disabled by default because of heap memory 
 * to enable and use it in aggregation 
 * 
 * Change properties via Mapping API  
 *  
 * 
 * Bucketing: 
 *  - data can be keyed using keyed: true 
 *  - and specifying the required key 
 *  - in the aggs function field 
 * 
 * aggs: { 
 *      bucket_name: { 
 *          terms: { 
 *              field: "gender"
 *          }
 *          
 *      }
 * 
 * }
 * 
 * Mutli-level aggregations can be used to 
 * create nested buckets. 
 * filter commands can be used to filter withing aggregation
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
        // const {body} = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query: { 
        //             bool: { 
        //                 must: [
        //                     {match : {state: 'alaska'}},
        //                     {match: {city: 'hamilton'}}
        //                 ]
        //             }
        //         }
        //     }
        // })

        /* Q10 - FILTER => Range query */
        // const {body} = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query: {
        //             bool: { 
        //                 must: { match_all:  {}}, 
        //                 filter: {
        //                     range: { 
        //                         age: { 
        //                             "gte" : 20, 
        //                             "lte" : 30
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })

        /* Q11 - FIlter by range and term */
        // const {body} = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query: { 
        //             bool: {
        //                 must: {
        //                     match : { 
        //                         state: 'alaska'
        //                     }
        //                 },


        //                 filter: [
        //                     {term: {gender: 'female'}},  
        //                     {range : {age: {lte : 50}}}
        //                 ]
        //             }
        //         }
        //     }
        // })


        /* Q12 - Metric Aggregation -> AVG */
        // const {body} = await client.search({
        //     index: 'customers', 

        //     body: {
        //         aggs: { 
        //             avg_age: { 
        //                 avg: {
        //                     field: "age" 
        //                 }
        //             }
        //         }
        //     }

        // })
        // console.log(body.aggregations); 

        /* Q13 - Combine Search and Aggregation */
        // const { body } = await client.search({
        //     index: 'customers', 
        //     body: { 
        //         query: { 
        //             bool: {
        //                 filter: {
        //                     match: {state: 'alaska'}
        //                 }
        //             }
        //         },
        //         aggs: { 
        //             avg_age: { 
        //                 avg: {
        //                     field: "age" 
        //                 }
        //             }
        //         }

        //     }

        // })
        // console.log(body.aggregations); 


        /* Q14 - Stats Aggregation */
        const { body } = await client.search({
            index: 'customers',
            body: { 
                aggs: { 
                    "age_stats" : { 
                        "stats" : {
                            field: "age"
                        }
                    }
                }
            }
        })  
        console.log(body.aggregations); 


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
