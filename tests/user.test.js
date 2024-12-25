const app = require("../src/app")
const request = require("supertest")
const User = require("../src/models/users")
const {userOne,userOneId,setupDatabase}=require("./fixtures/db")


beforeEach(setupDatabase)

test("User sign up test", async () => {
    const response = await request(app).post("/users").send({
        name: "hany",
        age: 21,
        email: "hanyelhamywa@gmail.com",
        password: "hany777"
    }).expect(201)

    //Assert user is saved in Database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the repsonse
    expect(response.body).toMatchObject({
        user: {
            name: "hany",
            email: "hanyelhamywa@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("hany777")
})

test("Shouldnt sign up user with invalid email",async()=>{
    await request(app)
    .post("/users")
    .send({
        email:"..ajhs.com",
        password:"pass123",
        name:"Alex",
        age:20
    })
    .expect(400)
})

test("Should Login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //Assert token is saved
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})
test("Shouldnt login nonexistent user", async () => {
    await request(app).post("/users/login").send({
        email: "shady@gmail.com",
        password: "12345467"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Shouldnt get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})


test("Should delete user", async () => {
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert user is deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test("Shouldn't delete unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should update user avatar",async()=>{
    await request(app)
    .post("/users/me/avatar")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .attach("avatar","tests/fixtures/background.jpeg")
    .expect(200)

    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields",async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:"Jackson"
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe("Jackson")
})

test("Shouldnt update invalid user fields",async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"greece"
    })
    .expect(400)
})

test("Shouldnt update user with invalid email",async()=>{
    await request(app)
    .patch("/users/me")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        email:"haksjbd.com"
    })
    .expect(400)
    const user=await User.findById(userOne._id)
    expect(user.email).toEqual(userOne.email)
})