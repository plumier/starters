import bcrypt from "bcryptjs"
import { authorize, genericController, preSave, val } from "plumier"
import { Column, Entity } from "typeorm"

import { EntityBase } from "../_shared/entity-base"

@genericController(c => {
    // POST /users accessible by public
    c.post().authorize("Public")

    // PUT PATCH DELETE GET /users/{id} only accessible by the user itself 
    // See the user-policy.ts file how ResourceOwner defined
    c.methods("Delete", "GetOne", "Patch", "Put").authorize("ResourceOwner")

    // GET /users?limit&offset&filter only accessible by Admin
    c.getMany().authorize("Admin")
})
@Entity()
export class User extends EntityBase {
    // email will only visible by the user itself
    @authorize.read("ResourceOwner")
    @val.required()
    @val.unique()
    @val.email()
    @Column()
    email: string

    // password will not visible to anyone
    @authorize.writeonly()
    @val.required()
    @Column()
    password: string

    @val.required()
    @Column()
    name:string

    // role only can be set by Admin
    @authorize.write("Admin")
    // role only visible to the user itself or by Admin
    @authorize.read("ResourceOwner", "Admin")
    @Column({ default: "User" })
    role: "User" | "Admin"

    @preSave()
    async hashPassword() {
        if (this.password)
            this.password = await bcrypt.hash(this.password, await bcrypt.genSalt())
    }
}