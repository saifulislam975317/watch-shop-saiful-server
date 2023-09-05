const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// Mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stpdj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // collections names
    const watchesCollection = client.db("watchShopDb").collection("watches");
    const reviewCollection = client.db("watchShopDb").collection("reviews");
    const cartsCollection = client.db("watchShopDb").collection("carts");

    // api routes
    app.get("/watchData", async (req, res) => {
      const result = await watchesCollection.find({}).toArray();
      res.send(result);
    });

    // review api
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await cartsCollection.insertOne(newItem);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("connected. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("watch shop server is running");
});

app.listen(port, () => {
  console.log(`watch shop server is running at ${port}`);
});