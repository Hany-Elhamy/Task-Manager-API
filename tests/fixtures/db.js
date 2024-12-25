const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("../../src/models/users")
const tasks=require("../../src/models/tasks")



const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "hany",
    email: "hany@gmail.com",
    password: "pass1234",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Sherief",
    email: "sherief@gmail.com",
    password: "pass1234",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne={
    _id:new mongoose.Types.ObjectId(),
    description:"First Task",
    completed:false,
    owner:userOne._id
}

const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    description:"Second Task",
    completed:true,
    owner:userOne._id
}

const taskThree={
    _id:new mongoose.Types.ObjectId(),
    description:"Third Task",
    completed:true,
    owner:userTwo._id
}

const setupDatabase = async()=>{
    await User.deleteMany()
    await tasks.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new tasks(taskOne).save()
    await new tasks(taskTwo).save()
    await new tasks(taskThree).save()


}

module.exports={
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}