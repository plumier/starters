import dotenv from "dotenv"
import { sign } from "jsonwebtoken"
import mongoose from "mongoose"
import { join } from "path"
import supertest from "supertest"

import { LoginUser } from "../src/api/_shared/login-user"
import { User } from "../src/api/user/user-entity"
import model from "@plumier/mongoose"


dotenv.config({ path: join(__dirname, ".env-test") })

export function createToken(id: string, role: "User" | "Admin") {
    return sign(<LoginUser>{ userId: id, role }, process.env.PLUM_JWT_SECRET!)
}

export const ignoreProps = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
}

export const userToken = createToken("123", "User")
export const adminToken = createToken("456", "Admin")

export async function createUser(app: any, user: Partial<User> = {}) {
    const { body } = await await supertest(app.callback())
        .post("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            email: user.email ?? "john.doe@gmail.com",
            password: user.password ?? "john0doe#",
            name: user.name ?? "John Doe",
            role: user.role ?? "User"
        }).expect(200)
    const token = createToken(body.id, user.role ?? "User")
    return { id: body.id, token }
}
