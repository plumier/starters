import { entityPolicy } from "plumier"

import { User } from "./user-entity"


entityPolicy(User)
    // ResourceOwner means when the current User record (specified by ID)
    // where the ID is the same as current login user ID
    .register("ResourceOwner", (ctx, id) => ctx.user?.userId === id)