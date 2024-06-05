const express = require('express') 
const app = express() 
const port = process.env.PORT || 3000; 
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
app.use(express.json())  

app.get('/', (req, res) => { 
   res.send('Hello World!') 
}) 

app.listen(port, () => { 
   console.log(`Example app listening on port ${port}`)
}) 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://teeshihqun:QRdiKSGJzBig3Emd@cluster0.mf16fys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.post('/user', async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
  // Store hash in your password DB.
    let result = await client.db("teeshihqun").collection("lab").insertOne(
      //await must with async
      {
        name: req.body.name,
        email: req.body.email,
        year: req.body.year,
        password: hash,
      });
    console.log(result);
    res.json(result);
  })

  app.get('/user/:username', async (req, res) => {
    console.log(req.params.username);
    let result = await client.db("teeshihqun").collection("lab").findOne(
      {
        name: req.params.username,
      });
    console.log(result);
    res.json(result);
  })
  
  app.patch('/user/:id', async (req, res) => {
    let result = await client.db("teeshihqun").collection("lab").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          email: req.body.email,
        },
      });
    console.log(result);
    res.json(result);
  })
  
  app.delete('/user/:id', async (req, res) => {
    let result = await client.db("teeshihqun").collection("lab").deleteOne(
      {
        _id: new ObjectId(req.params.id),
      });
    console.log(result);
    res.json(result);
  })
