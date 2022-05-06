const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mzmki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const suppliesCollection = client.db('juicy-warehouse').collection('product');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = suppliesCollection.find(query);
            const supplies = await cursor.toArray();
            res.send(supplies);
        });

        app.get('/inventory/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const supply = await suppliesCollection.findOne(query);
            res.send(supply);
        })
    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running juicy warehouse');
});

app.listen(port, () => {
    console.log('listening', port);
});