const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//import dir
const User = require("./models/user");
const Pet = require("./models/pet");

//SETTING UP MONGODB
//CONNECT MONGODB DATABASE
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/eval";
mongoose.connect(dbUrl);

mongoose
  .connect(dbUrl, { useNewUrlParser: "true" })
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });

const app = express();
//middleware
app.use(cors());
app.use(express.json());
  
app.get("/owners", async (req, res) => {
  const owners = await User.find({}).populate("friend_id").populate("pet_id");
  res.json({ status: 200, owners: owners });
});

app.post("/owners", async (req, res) => {
  const owner = new User(...req.body.user);
  await owner.save();
  res.json({ status: 200, owner: owner });
});

app.get("/owners/:id", async (req, res) => {
  const { id } = req.params;
  const owner = await User.findById(id)
    .populate("friend_id")
    .populate("pet_id");
  res.json({ status: 200, owner: owner });
});

app.put("/owners/:id", async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, {
    ...req.body.user,
  });
  res.json({ status: 200 });
});

app.delete("/owners/:id", async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  await res.json({ status: 200 });
});

//removes petid from owner id and vice versa
app.get("/pets", async (req, res) => {
  const pets = await Pet.find({});
  res.json({ status: 200, pets });
});

app.post("/pets", async (req, res) => {
  const petdata = req.body.pet;
  console.log(JSON.stringify(petdata));
  // const newpet  = new Pet(petdata);
  const newpet = new Pet({
    pet_name: req.body.pet.pet_name,
  });
  await newpet.save();
  res.json({ status: 200 });
});

app.get("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findById(id);
  res.json({ status: 200, pet: pet });
});

app.delete("/pets/:id", async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndDelete(id);
  res.json({ status: 200 });
});

//edit pet username
app.put("/pets/:id", async (req, res) => {
  const { id } = req.params;
  await Pet.findByIdAndUpdate(id, {
    ...req.body.pet,
  });
  res.json({ status: 200 });
});

app.delete("/owners/:id/pets/:petid", async (req, res) => {
  const { id, petid } = req.params;
  await User.findByIdAndUpdate(id, { $pull: { pet_id: petid } }); //delete pet relationship from user
  await Pet.findByIdAndUpdate(petid, { $set: { user_id: id } });
  res.json({ status: 200 });
});

app.post("/owners/:id/friends/:friendid", async (req, res) => {
  const { id, friendid } = req.params;
  //find owner
  const user = await User.findById(id);
  //find friend
  const friend = await User.findById(friendid);

  user.friend_id.push(friend);
  First.friend_id.push(user);
});

const port = 3002;
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
