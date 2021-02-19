import supertest from "supertest"
import createTypeORMApp from "../rest-api-typeorm/src/app"
import createMongooseApp from "../rest-api-mongoose/src/app"
import "@plumier/testing"

it("rest-api-typeorm should run properly", async () => {
    const mock = console.mock()
    const app = await createTypeORMApp()
    await supertest(app.callback())
        .get("/swagger/index")
        .expect(200)
    console.mockClear()
    expect(mock.mock.calls).toMatchSnapshot()
})

it("rest-api-mongoose should run properly", async () => {
    const mock = console.mock()
    const app = await createMongooseApp()
    await supertest(app.callback())
        .get("/swagger/index")
        .expect(200)
    console.mockClear()
    expect(mock.mock.calls).toMatchSnapshot()
})