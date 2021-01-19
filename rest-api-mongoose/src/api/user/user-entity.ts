import { collection } from "@plumier/mongoose"
import bcrypt from "bcryptjs"
import { authorize, preSave, route, val } from "plumier"

import { EntityBase } from "../_shared/entity-base"

@route.controller(c => {
    c.post().authorize("Public")
})
@collection()
export class User extends EntityBase {
    @val.required()
    @val.unique()
    @val.email()
    email: string

    @authorize.writeonly()
    @val.required()
    password: string

    @collection.property({ default: "User" })
    role: "User" | "Admin"

    @preSave()
    async hashPassword() {
        if (this.password)
            this.password = await bcrypt.hash(this.password, await bcrypt.genSalt())
    }
}