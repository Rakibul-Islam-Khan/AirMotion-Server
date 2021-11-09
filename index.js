const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
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
      const database = client.db("packageCollection");
      const packageCollection = database.collection("package");
  
    } finally {
      //   await client.close();
    }
  }
  run().catch(console.dir);
  app.get('/', (req, res) => {
    res.send('Hello motion:) i have launch new drone website')
  })
  app.listen(port,console.log(`listening on port ${port}`))