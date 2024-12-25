const app = require("../src/app")
const request = require("supertest")
const tasks = require("../src/models/tasks")
const { 
    userOne, 
    userOneID,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
    } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should create a task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "for my  test"
        })
        .expect(201)

    const task = await tasks.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(task.completed).toEqual(false)
})

test("Should get all tasks for a user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test("Shouldnt update other users task",async()=>{
    await request(app)
    .patch("/tasks/"+taskOne._id)
    .set("Authorization",`Bearer ${userTwo.tokens[0].token}`)
    .send({
        completed:true
    })
    .expect(404)

    const task=await tasks.findById(taskOne._id)
    expect(task.completed).toEqual(false)
})

test("Should fail in deleting other user's tasks",async()=>{
    const response=await request(app)
    .delete("/tasks/"+taskOne._id)
    .set("Authorization",`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task=await tasks.findById(taskOne._id)
    expect(task).not.toBeNull()

})

test("Should delete user task",async()=>{
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const task=await tasks.findById(taskOne._id)
    expect(task).toBeNull()

})


test("Should sort tasks by createdAt",async()=>{
    const response=await request(app)
    .get("/tasks?sortBy=createdAt:asc")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    //Two ways to assert that the order of tasks is correct
    expect(response.body[0]._id).toEqual(taskOne._id.toString())
    expect(response.body[0]).toMatchObject({
        _id:taskOne._id.toString()
    })
})




