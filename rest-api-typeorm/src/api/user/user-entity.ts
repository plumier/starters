import { route, val } from "plumier"
import { Entity } from "typeorm"

import { EntityBase } from "../_shared/entity-base"

@route.controller()
@Entity()
export class User extends EntityBase {
    @val.email()
    email: string
}