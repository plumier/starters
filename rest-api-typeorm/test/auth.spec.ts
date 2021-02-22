import decode from "jwt-decode"
import supertest from "supertest"

import createApp from "../src/app"
import { closeConnection, createUser } from "./helper"

afterEach(async () => {
    await closeConnection()
})

describe("Authorization", () => {
    it("Should able to login properly", async () => {
        const app = await createApp({ mode: "production" })
        const user = { email: "lorem@ipsum.com", password: "lorem" }
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        expect(decode(tokens.token)).toMatchSnapshot({ iat: expect.any(Number), exp: expect.any(Number) })
        expect(decode(tokens.refreshToken)).toMatchSnapshot({ iat: expect.any(Number) })
    })

    it("Should able to request refresh token with refresh token", async () => {
        const app = await createApp({ mode: "production" })
        const user = { email: "lorem@ipsum.com", password: "lorem" }
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        const { body: secondTokens } = await supertest(app.callback())
            .post("/auth/refresh")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .expect(200)
        expect(decode(secondTokens.token)).toMatchSnapshot({ iat: expect.any(Number), exp: expect.any(Number) })
        expect(decode(secondTokens.refreshToken)).toMatchSnapshot({ iat: expect.any(Number) })
    })

    it("Should not able to request refresh token with token", async () => {
        const app = await createApp({ mode: "production" })
        const user = { email: "lorem@ipsum.com", password: "lorem" }
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        await supertest(app.callback())
            .post("/auth/refresh")
            .set("Authorization", `Bearer ${tokens.token}`)
            .expect(401)
    })

    it("Should able to access private route using token", async () => {
        const app = await createApp({ mode: "production" })
        const user = { email: "lorem@ipsum.com", password: "lorem" }
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        await supertest(app.callback())
            .post("/auth/logout")
            .set("Authorization", `Bearer ${tokens.token}`)
            .expect(200)
    })

    it("Should not able to access private route using refresh token", async () => {
        const app = await createApp({ mode: "production" })
        const user = { email: "lorem@ipsum.com", password: "lorem" }
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        await supertest(app.callback())
            .post("/auth/logout")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .expect(401)
    })
})