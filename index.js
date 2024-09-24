const express = require("express");

//import database of json format
// const fs = require("fs");

//import database of bson format by mongodb
const mongoose=require("mongoose");

//connect with mongoDb 
mongoose.connect('mongodb://127.0.0.1:27017/rest_api')
.then(()=>{
  console.log("MongoDb connected")
})
.catch((error)=>{
  console.log(error)
});

//set schema
const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true 
  },
  lastName:{
    type:String,
  },
  gender:{
    type:String 
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  jobTitle:{
    type:String,
    required:true,
  }

},
{
  timestamps:true
});

//import user from json file
// const users = require("./MOCK_DATA (1).json");
// const { type } = require("os");

//set user object 
const User=new mongoose.model("users",userSchema);


const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));

//--server side rendering
app.get("/user", async(req, res) => {
  const userDb=await User.find({});
  const html = `
    <ul>
        ${userDb
          .map((user) => {
            return `<li>
            ${user.firstName}
            </li>`;
          })
          .join("")}
    </ul>
    `;
  res.send(html);
});

//--client side rendering
app.get("/api/user", async(req, res) => {
  const users=await User.find({});
  res.send(users);
  //it directly convert the content-type as the type of content

  // res.json(users);
  //it is directly convert js object to JSON format

  // res.end(JSON.stringify(users));
  //we can convert it to JSON format through JSON.stringfy() function
});

app.get("/api/user/:id", async(req, res) => {
  const user=await User.findById(req.params.id);
  res.json(user);
});

app.post("/api/user", async(req, res) => {
  const body = req.body;
  if(
    !body||
    !body.first_name||
    !body.last_name||
    !body.email||
    !body.gender||
    !body.job_title
  ){
    return res.status(400).json({msg:"All field are required"});
  }
  
  const user=await User.create({
    firstName:body.first_name,
    lastName:body.last_name,
    gender:body.gender,
    email:body.email,
    jobTitle:body.job_title
  });

  return res.status(201).json(user);

});



app.patch("/api/user/:id", (req, res) => {
  const updates = req.body;
  const id = req.params.id;

  const index = users.findIndex((user) => user.id == id);

  users[index] = { ...users[index], ...updates };

  fs.writeFile(
    "./MOCK_DATA (1).json",
    JSON.stringify(users),
    (error, response) => {
      res.end({ status: "ok" });
    }
  );
});

app.delete("/api/user/:id", (req, res) => {
  const id = req.params.id;

  const index = users.findIndex((user) => user.id == id);

  users[index] = {};

  fs.writeFile(
    "./MOCK_DATA (1).json",
    JSON.stringify(users),
    (error, response) => {
      res.json({ status: "ok" });
    }
  );
});
app.listen(8000, () => {
  console.log("server started");
});
