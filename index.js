const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rirnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("productCollection");
    const productCollection = database.collection("product");
    const reviewCollection = database.collection("review");
    const orderCollection = database.collection("orders");
    const usersCollection = database.collection("users");

    // get products collection
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const products = await cursor.toArray();
      res.send(products);
    })

    // get product by id
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
    })
 
    // post new product
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    })

    // get reviews collection
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({})
      const reviews = await cursor.toArray();
      res.send(reviews);
    })

    // post new review
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    })
    // get orders collection
    app.get('/orders', async (req, res) => {
      const cursor = orderCollection.find({})
      const orders = await cursor.toArray();
      res.send(orders);
    })
    // post new order
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    })
    // delete order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    })
    // post user collection
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    })

    // put admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const update = { $set: { role: 'admin'} };
      const result = await usersCollection.updateOne(filter, update);
      res.json(result);
    })
    // get admin
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user?.role === 'admin') {
        admin = true;
      }
      res.json({admin: admin});
    })
  } catch(e){
    console.log(e);
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello motion:) i have launch new drone website')
})
app.listen(port, console.log(`listening on port ${port}`))
