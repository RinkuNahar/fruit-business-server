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
        const orderCollection = client.db('juicy-warehouse').collection('order');

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
        });

        // POST
        app.post('/inventory', async(req,res)=>{
            const newProduct = req.body;
            const result = await suppliesCollection.insertOne(newProduct);
            res.send(result);
        });

        // DELETE
        app.delete('/inventory/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await suppliesCollection.deleteOne(query);
            res.send(result);
        });

        // Order Collection

        app.get('/order', async(req,res)=>{
            const email = req.query.email;
            const query ={email: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/order', async(req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

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