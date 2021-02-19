import supertest from "supertest"
import createApp from "../src/app"
import "@plumier/testing"
import {join} from "path"
import dotenv from "dotenv"

dotenv.config({ path: join(__dirname, "./.env-test") })

it("Should initialized properly", async () => {
    const mock = console.mock()
    const app = await createApp()
    console.mockClear()
    expect(mock.mock.calls).toMatchSnapshot()
})
