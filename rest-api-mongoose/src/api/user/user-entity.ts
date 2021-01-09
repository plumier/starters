import { route, val } from "plumier"
import { collection } from "@plumier/mongoose"

import { EntityBase } from "../_shared/entity-base"

@route.controller()
@collection()
export class User extends EntityBase {
    @val.email()
    email: string
}