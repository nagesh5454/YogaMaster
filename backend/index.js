const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//Verify tokens
const verifyJWT=(req,res,next)=>{
  const authorization=req.headers.authorization;
  if(!authorization){
    return res.status(401).send({message:'Invalid authrization'})
  }

  const token =authorization?.split(' ')[1];
  jwt.verify(token,process.env.ASSESS_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403).send({messege:'Forbidden access'})
    }
    req.decoded=decoded;
    next();
  })
}


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.qsloeec.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

let client;

async function connectToMongoDB(retries = 5) {
  while (retries) {
    try {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      console.log("Successfully connected to MongoDB!");
      return;
    } catch (error) {
      retries -= 1;
      console.log(
        `Retrying to connect to MongoDB (${retries} retries left)...`
      );
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Could not connect to MongoDB after several attempts");
}

async function run() {
  try {
    await connectToMongoDB();

    // create a database and collections
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    //routes for users
    app.post("/api/set-token", async (req, res) => {
      try {
        const user = req.body;
        // Optionally, validate the user object here
        if (!user) {
          return res
            .status(400)
            .send({ error: "User data is required " });
        }
        const token = jwt.sign(user, process.env.ASSESS_SECRET, {
          expiresIn: "24h",
        });
        res.send({ token });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });




    //middleware for admit and instructor
    
    // const verifyAdmin=async(req,res,next)=>{
    //   const email=req.decoded.email;
    //   const query={email:email};
    //   const user=await usersCollection.findOne(query);
    //   if(user.role==='admin'){
    //     next();
    //   }else{
    //     return res.status(401).send({message:'Unauthorised  access'})
    //   }
    // }

    // const verifyInstructor=async(req,res,next)=>{
    //   const email=req.decoded.email;
    //   const query={email:email};
    //   const user=await usersCollection.findOne(query);
    //   if(user.role==='instructor'){
    //     next();
    //   }else{
    //     return res.status(401).send({message:'unauthorized access'})
    //   }
    // };

    const verifyAdmin = async (req, res, next) => {
      try {
        const email = req.decoded.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
    
        if (user.role === 'admin') {
          next();
        } else {
          return res.status(401).send({ message: 'Unauthorized access' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    };
    
    const verifyInstructor = async (req, res, next) => {
      try {
        const email = req.decoded.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
    
        if (user.role === 'instructor') {
          next();
        } else {
          return res.status(401).send({ message: 'Unauthorized access' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    };


    app.post("/new-user", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/user/:email",  verifyJWT,async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    app.delete("/delete-user/:id", verifyJWT, verifyAdmin,async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/update-user/:id",verifyJWT,verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.option,
          address: updatedUser.address,
          about: updatedUser.about,
          photoUrl: updatedUser.photoUrl,
          skills: updatedUser.skills ? updatedUser.skills : null,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // classes routes here
    app.post("/new-class",verifyJWT, verifyAdmin,async (req, res) => {
      const newClass = req.body;
      try {
        const result = await classesCollection.insertOne(newClass);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get("/classes",async (req, res) => {
      try {
        const classes = await classesCollection.find({}).toArray();
        res.send(classes);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get classes by instructor email address
    app.get("/classes/:email", verifyJWT,verifyInstructor,async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      try {
        const result = await classesCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // manage classes
    app.get("/classes-manage", async (req, res) => {
      try {
        const result = await classesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // update class status and reason
    app.patch("/change-status/:id",verifyJWT, verifyAdmin,async (req, res) => {
      const id = req.params.id;
      const { status, reason } = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason,
        },
      };
      try {
        const result = await classesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get approved classes
    app.get("/approved-classes", async (req, res) => {
      const query = { status: "approved" };
      try {
        const result = await classesCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get single class details
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await classesCollection.findOne(query);
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "Class not found" });
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // update class details (all data)
    app.put("/update-class/:id", verifyJWT,verifyInstructor,async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: "pending",
        },
      };
      try {
        const result = await classesCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    //Cart Routes !---------
    app.post("/add-to-cart",verifyJWT, async (req, res) => {
      const newCartItem = req.body;
      try {
        const result = await cartCollection.insertOne(newCartItem);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get Cart item by id
    app.get("/cart-item/:id",verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const projection = { classId: 1 };

      try {
        const result = await cartCollection.findOne(query, { projection });
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "Cart item not found" });
        }
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // get Cart items by user email
    app.get("/cart/:email",verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };

      try {
        const carts = await cartCollection
          .find(query, { projection })
          .toArray();
        const classIds = carts.map((cart) => new ObjectId(cart.classId));
        const query2 = { _id: { $in: classIds } };
        const result = await classesCollection.find(query2).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    //delete cart item
    app.delete("/delete-cart-item/:id",verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //payment Routes
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { price } = req.body;
        if (!price || isNaN(price)) {
          return res.status(400).send({ error: "Invalid price" });
        }
        const amount = parseInt(price) * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    //post payment info to db
    app.post("/payment-info",verifyJWT, async (req, res) => {
      const paymentInfo = req.body;
      const classesId = paymentInfo.classesId;
      const userEmail = paymentInfo.userEmail;
      const signleClassId = req.query.classId;
      let query;
      if (signleClassId) {
        query = { classId: signleClassId, userMail: userEmail };
      } else {
        query = { classesId: { $in: classesId } };
      }

      const classesQuery = {
        _id: { $in: classesId.map((id) => new ObjectId(id)) },
      };
      const classes = await classesCollection.find(classesQuery).toArray();
      const newEnrolledData = {
        userEmail: userEmail,
        classId: signleClassId.map((id) => new ObjectId(id)),
        trasactionId: paymentInfo.trasactionId,
      };

      const updateDoc = {
        $set: {
          totalEnrolled:
            classes.reduce(
              (total, current) => total + current.totalEnrolled,
              0
            ) + 1 || 0,
          availableSeats:
            classes.reduce(
              (total, current) => total + current.availableSeats,
              0
            ) - 1 || 0,
        },
      };

      const updateResult = await classesCollection.updateMany(
        classesQuery,
        updateDoc,
        { upsert: true }
      );
      const enrolledResult = await enrolledCollection.insertOne(
        newEnrolledData
      );
      const deleteResult = await cartCollection.deleteMany(query);
      const paymentResult = await paymentCollection.insertOne(paymentInfo);

      res.send(paymentResult, deleteResult, enrolledResult, updateResult);
    });

    //get payment history

    app.get("/payment-history/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await paymentCollection
        .find(query)
        .sort({ data: -1 })
        .toArray();
      res.send(result);
    });

    //payment history length
    app.get("/payment-history/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const total = await paymentCollection.countDocuments(query);
      res.send(total);
    });

    //Enrollment Routes
    app.get("/popular_classes", async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ totalEnrolled: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/popular-instructors", async (req, res) => {
      try {
        const pipeline = [
          {
            $group: {
              _id: "$instructorEmail",
              totalEnrolled: { $sum: "$totalEnrolled" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "email",
              as: "instructor",
            },
          },
          {
            $project: {
              _id: 0,
              instructor: {
                $arrayElemAt: ["$instructor", 0],
              },
              totalEnrolled: 1,
            },
          },
          {
            $sort: {
              totalEnrolled: -1,
            },
          },
          {
            $limit: 6,
          },
        ];

        const result = await classesCollection.aggregate(pipeline).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    //admin status
    app.get("/admin-stats",verifyJWT,verifyAdmin, async (req, res) => {
      try {
        const approvedClasses = (
          await classesCollection.find({ status: "approved" }).toArray()
        ).length;
        const pendingClasses = (
          await classesCollection.find({ status: "pending" }).toArray()
        ).length;
        const instructors = (
          await usersCollection.find({ role: "instructor" }).toArray()
        ).length;
        const totalClasses = (await classesCollection.find().toArray()).length;
        const totalEnrolled = (await enrolledCollection.find().toArray())
          .length;

        const result = {
          approvedClasses,
          pendingClasses,
          instructors,
          totalClasses,
          totalEnrolled,
        };

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // get all instructors

    app.get("/instructors", async (req, res) => {
      const result = await usersCollection
        .find({ role: "instructor" })
        .toArray();
      res.send(result);
    });

    app.get("/enrolled-classes/:email", verifyJWT,async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const pipeline = [
        {
          $match: query,
        },
        {
          $lookup: {
            from: "classes",
            localField: "classesId",
            foreignField: "_id",
            as: "classes",
          },
        },
        {
          $unwind: "$classes",
        },
        {
          $lookup: {
            from: "users",
            local: "classes.instructorEmail",
            foreignField: "email",
            as: "instructor",
          },
        },
        {
          $project: {
            _id: 0,
            instructor: {
              $arrayElemAt: ["$instructor", 0],
            },
            classes: 1,
          },
        },
      ];
      const result = await enrolledCollection.aggregate(pipeline).toArray();
      res.send(result);
    });

    //applied for instructors
    app.post("/ass-instructor", async (req, res) => {
      const data = req.body;
      const result = await appliedCollection.insertOne(data);
      res.send(result);
    });

    app.get("/applied-instructors/:email", async (req, res) => {
      const email = req.params.email;
      const result = await appliedCollection.findOne({ email });
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("Hello Developers 2025!");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err.stack);
  }
}

run().catch(console.dir);
