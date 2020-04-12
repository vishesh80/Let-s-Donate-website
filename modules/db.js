const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/letsDonate", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
/*-------------------------Schema and Models----------------------------------- */


// user signup Model
const userModel = mongoose.model(
  "Users",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: String,
    state: String,
    city: String,
    url: {type: String, default: null},
    isV: Boolean,
  })
);

// NGO signup Model
const ngoModel = mongoose.model(
  "NGOs",new mongoose.Schema({
    ngoName: String,
    email: String,
    password: String,
    address: String,
    state: String,
    city: String,
    url: { type: String, default: null},
    lat: { type: Number , default: 0},
    long: { type: Number, default: 0 },
    isV: Boolean
  })
);


// Events Model
const eventModel = mongoose.model(
  "events", new mongoose.Schema({
    Name: String,
    Time: String,
    Date: String,
    Address: String,
    email: String
  })
);


/*------------------------------------Functions-------------------------------------------- */

//Sign Up
async function createUser(data) {

  let check = await userModel.find({ email: data.email }).select({ email: 1});

  if(check.length !== 0) throw new Error("Email already in use.");

  let user = await new userModel({
    username: data.username,
    email: data.email,
    password: data.password,
    age: data.age,
    state: data.state,
    city: data.city,
    isV: data.isV
  });

  return await user.save();
}


async function createNgo(data) {

  let check = await ngoModel.find({ email: data.email }).select({ email: 1 });

  if (check.length !== 0) throw new Error("Email already in use.");

  let ngo = await new ngoModel({
    ngoName: data.ngoName,
    email: data.email,
    password: data.password,
    address: data.address,
    state: data.state,
    city: data.city,
    isV: data.isV
  });

  return await ngo.save();
}



// Login function
async function loginUser(data) {

  let user = await userModel.find({email: data.email , password: data.password}).select({email: 1});

  if(user.length !== 0)  return user;
  else throw new Error("Invalid Email or password");
}

async function loginNgo(data) {

  let ngo = await ngoModel.find({ email: data.email, password: data.password }).select({ email: 1 });

  if (ngo.length !== 0) return ngo;
  else throw new Error("Invalid Email or password");
}

//Account functions

async function accountUser(data) {
  let user = await userModel.find({ email: data.email}).select({password: 0 , _id: 0});

  if (user.length !== 0) return user[0];
  else throw new Error("Cant find the user account");
}

async function accountNgo(data) {
  let ngo = await ngoModel.find({ email: data.email}).select({password: 0 , _id: 0});

  if (ngo.length !== 0) return ngo[0];
  else throw new Error("Cant find the user account");
}

//------------------Api fucntions-----------------------------------------

async function createEvent(data)
{

  let event = await new eventModel({
    Name: data.eventName,
    Time: data.eventTime,
    Date: data.eventDate,
    Address: data.eventAddress,
    email: data.email
  });

  return event.save();
}

async function deleteEvent(data) {

  let result = await eventModel.deleteOne({Name : data.eventName});

  return result;
}

async function getEvents(data) {

  if(data.user)
  {
    let result = await eventModel.find({}).sort({ _id: -1 });
    return result;
  }
  else
  {
    let result = await eventModel.find({ email: data.email }).sort({ _id: -1 });
    return result;
  }
}

async function varified(data)
{
    let ngo = await ngoModel.findOne({ email: data.email });
    let user = await userModel.findOne({email:data.email});

    if(ngo !== null)
    {
        ngo.isV = true;
        await ngo.save();
    }
     if (user !== null) {
       user.isV = true;
       await user.save();
     }
    
    return;
}

async function addlocation(data)
{
    let ngo = await ngoModel.findOne({ email: data.email });
    
    ngo.lat = data.lat;
    ngo.long = data.long;
    await ngo.save();

    return data;
}

async function getlocations() {
  let ngos = await ngoModel.find({}).select({
    lat: 1 ,
    long: 1,
    ngoName: 1,
    address: 1,
    state: 1,
    city: 1,
    _id: 0
  });
  return ngos;
}


async function search(data) {
 
  if(/^Nquery$/.test(data.query)) return await ngoModel.find({}).select({ngoName:1,address:1,state:1 , city:1, url:1});
  if(/^Uquery$/.test(data.query)) return await userModel.find({}).select({username:1, age:1, state:1, city:1, url:1 });
  
  let regex = new RegExp("^"+data.query,"ig");
  console.log(regex);
  let ua = await userModel.find({username: regex}).select({ username:1, age:1, state:1, city:1 ,url:1});
  let na = await ngoModel.find({ngoName: regex}).select({ ngoName:1, address:1, state:1, city:1,url:1 });

  return ua.concat(na);
}


async function saveImg(data)
{
  let user,ngo;

  if(data.user)
  {
        user = await userModel.findOne({ email: data.email });
        user.url = data.url;
        await user.save();
        return { url: data.url };
  }
  else
  {
        ngo = await ngoModel.findOne({ email: data.email });
        ngo.url = data.url;
        await ngo.save();
        return {url: data.url};
  }
}
/*---------------------------Exports------------------------------------------------------- */
module.exports.createUser = createUser;
module.exports.createNgo = createNgo;

module.exports.loginUser = loginUser;
module.exports.loginNgo = loginNgo;

module.exports.accountUser = accountUser;
module.exports.accountNgo = accountNgo;

module.exports.createEvent = createEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.getEvents = getEvents;

module.exports.varified = varified;

module.exports.addlocation = addlocation;
module.exports.getlocations = getlocations;

module.exports.search = search;

module.exports.saveImg = saveImg;
