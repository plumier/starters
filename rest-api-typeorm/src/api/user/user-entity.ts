import { authorize, preSave, route, val } from "plumier"
import { Column, Entity } from "typeorm"
import bcrypt from "bcryptjs"

import { EntityBase } from "../_shared/entity-base"

@route.controller(c => {
    c.post().authorize("Public")
})
@Entity()
export class User extends EntityBase {
    @val.required()
    @val.unique()
    @val.email()
    @Column()
    email: string

    @authorize.writeonly()
    @val.required()
    @Column()
    password: string

    @Column({ default: "User" })
    role: "User" | "Admin"

    @preSave()
    async hashPassword() {
        if (this.password)
            this.password = await bcrypt.hash(this.password, await bcrypt.genSalt())
    }
}