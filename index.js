const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server running')
});

app.listen(port, () => {
    console.log('server running on ', port)
});

// DB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmhhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function geniusCar() {
    try {
        await client.connect();
        // console.log('db connected')

        const database = client.db('carMachanic');
        const serviceCollection = database.collection('services');

        // GET API (TO ALOAD ALL DATA)
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        // GET A SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('particular service ', id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            /*  const service = {
                 "name": "ENGINE DIAGNOSTIC",
                 "price": "300",
                 "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
                 "img": "https://i.ibb.co/dGDkr4v/1.jpg"
             } */
            const service = req.body;
            console.log(service)
            const result = await serviceCollection.insertOne(service);
            console.log('hit the post api', result)
            // res.send('post hitted')
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
geniusCar().catch(console.dir)
