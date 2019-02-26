import { createApp } from "../src/app";
import supertest from "supertest"

describe("Application", () => {
    it("Should serve root route", async () => {
        const koa = await createApp({ mode: "production" })
        await supertest(koa.callback())
            .get("/")
            .expect(200)
    })
})