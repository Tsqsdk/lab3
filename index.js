const express = require('express') 
const app = express() 
const port = process.env.PORT || 3000; 
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
app.use(express.json())  
const jwt=require('jsonwebtoken');

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

//define middleware function
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json("Unauthorized: No token provided");
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded; // Optional: Attach user payload to request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(403).json("Unauthorized: Invalid token");
  }
};

//register endpoint
app.post('/register', async (req, res) => {
  let existingUser = await client.db("teeshihqun").collection("lab").findOne(
    {
      name: req.body.name,
    });
  if (existingUser) {
    res.json("user already exists");
  }else{
    const hash = bcrypt.hashSync(req.body.password, 10);
    // Store hash in your password DB.
    let newUser = await client.db("teeshihqun").collection("lab").insertOne(
      //await must with async
      {
        name: req.body.name,
        email: req.body.email,
        year: req.body.year,
        password: hash,
      });
    res.json("register success");
  }
});

//login endpoint
app.post('/login', async (req, res) => {
  let result = await client.db("teeshihqun").collection("lab").findOne(
    {
      name: req.body.name,
    });
  console.log(result);
  if (bcrypt.compareSync(req.body.password, result.password)==true) {
    var token=jwt.sign({
      _id:result._id,
      name:result.name,
    },'secretkey',{expiresIn:'1h'});
    res.json(token);
  } else {
    res.json("login failed");
  }
})

//user endpoint
app.get('/user/:id', verifyToken, async (req, res) => {
  console.log(req.params.username);
  if(req.user._id == req.params.id){
    console.log("authorized")
    let result = await client.db("teeshihqun").collection("lab").findOne(
      {
        _id: new ObjectId(req.params.id),
      });
    console.log(result);
    res.json(result);
  }
})

//user endpoint
app.patch('/user/:id', verifyToken, async (req, res) => {
    if(req.user._id == req.params.id){
      console.log("authorized")
        let result = await client.db("teeshihqun").collection("lab").updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: 
          {
            email: req.body.email,
          },
        });
      console.log(result);
      res.json(result);
    }
})
  
//user endpoint
app.delete('/user/:id', verifyToken, async (req, res) => {
  if(req.user._id == req.params.id){
    console.log("authorized")
    let result = await client.db("teeshihqun").collection("lab").deleteOne(
      {
        _id: new ObjectId(req.params.id),
      });
    console.log(result);
    res.json(result);
  }
})
