import decode from "jwt-decode"
import supertest from "supertest"

import createApp from "../src/app"
import { createUser } from "./helper"
import mongoose from "mongoose"
import { User } from "../src/api/user/user-entity"

jest.setTimeout(20000);

const tokenIgnore = { iat: expect.any(Number), exp: expect.any(Number), userId: expect.any(String) }

afterAll(async () => {
    await mongoose.disconnect()
})

describe("Authorization", () => {
    it("Should able to login properly", async () => {
        const user = { email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem" }
        const app = await createApp({ mode: "production" })
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        expect(decode(tokens.token)).toMatchSnapshot(tokenIgnore)
        expect(decode(tokens.refreshToken)).toMatchSnapshot(tokenIgnore)
    })

    it("Should able to request refresh token with refresh token", async () => {
        const user = { email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem" }
        const app = await createApp({ mode: "production" })
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        const { body: secondTokens } = await supertest(app.callback())
            .post("/auth/refresh")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .expect(200)
        expect(decode(secondTokens.token)).toMatchSnapshot(tokenIgnore)
        expect(decode(secondTokens.refreshToken)).toMatchSnapshot(tokenIgnore)
    })

    it("Should not able to request refresh token with token", async () => {
        const user = { email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem" }
        const app = await createApp({ mode: "production" })
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        await supertest(app.callback())
            .post("/auth/refresh")
            .set("Authorization", `Bearer ${tokens.token}`)
            .expect(403)
    })

    it("Should able to access private route using token", async () => {
        const user = { email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem" }
        const app = await createApp({ mode: "production" })
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
        const user = { email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem" }
        const app = await createApp({ mode: "production" })
        await createUser(app, user)
        const { body: tokens } = await supertest(app.callback())
            .post("/auth/login")
            .send(user)
            .expect(200)
        await supertest(app.callback())
            .post("/auth/logout")
            .set("Authorization", `Bearer ${tokens.refreshToken}`)
            .expect(403)
    })

    it("Should not able to login when suspended", async () => {
        const user = <User>{ email: `${new Date().getTime().toString(36)}@gmail.com`, password: "lorem", status: "Suspended" }
        const app = await createApp({ mode: "production" })
        await createUser(app, user)
        await supertest(app.callback())
            .post("/auth/login")
            .send({email: user.email, password: user.password})
            .expect(422)
    })
})