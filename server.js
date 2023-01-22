console.log('May Node be with you')

const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

//LINK TO DATABASE
MongoClient.connect('[MongoDB Credentials]', {
    useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to database.')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

    //MIDDLEWARE
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    //ROUTES
    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray()
            .then(quotes => {
                res.render('index.ejs', { quotes: quotes })
            })
            .catch(/* ... */)
        })

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote
            }
          },
          {
            upsert: true
          }
        )
          .then(result => res.json('Success'))
          .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
          { name: req.body.name }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quotes to delete.')
            }
            res.json('Deleted Darth Vader quote.')
          })
          .catch(error => console.error(error))
      })

    app.listen(3000, function(){
        console.log('listening on 3000')
    })

    })
    .catch(error => console.error(error))


