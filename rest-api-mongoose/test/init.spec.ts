import "@plumier/testing"

import dotenv from "dotenv"
import mongoose from "mongoose"
import { join } from "path"

import createApp from "../src/app"

dotenv.config({ path: join(__dirname, "./.env-test") })


it("Should initialized properly", async () => {
    const mock = console.mock()
    const app = await createApp()
    console.mockClear()
    expect(mock.mock.calls).toMatchSnapshot()
    await mongoose.disconnect()
})
